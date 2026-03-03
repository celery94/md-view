import {
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type ParagraphChild,
  type TableCell as DocxTableCell,
  type TableRow as DocxTableRow,
} from 'docx';

type DocxBlock = Paragraph | Table;

interface InlineStyleState {
  bold?: boolean;
  italics?: boolean;
  strike?: boolean;
  inlineCode?: boolean;
}

interface NumberingRefConfig {
  reference: string;
  levels: Array<{
    level: number;
    format: (typeof LevelFormat)[keyof typeof LevelFormat];
    text: string;
    alignment: 'left';
    style: {
      paragraph: {
        indent: {
          left: number;
          hanging: number;
        };
      };
    };
  }>;
}

const BULLET_REFERENCE = 'mdv-bullet-list';
const CODE_FONT = 'Consolas';
const BODY_FONT = 'Arial';
const PAGE_WIDTH_DXA = 9360; // Letter width with 1-inch margins on both sides.
const MAX_IMAGE_WIDTH = 520;
const BLOCK_TAGS = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'table',
  'img',
]);

const headingByTag: Record<string, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
  h5: HeadingLevel.HEADING_5,
  h6: HeadingLevel.HEADING_6,
};

class DocxPreviewConverter {
  private orderedListIndex = 0;

  private readonly numberingRefs: NumberingRefConfig[] = [this.createBulletNumbering()];

  public async convertContent(root: HTMLElement): Promise<DocxBlock[]> {
    const blocks = await this.convertChildren(root);
    return blocks.length > 0 ? blocks : [new Paragraph('')];
  }

  public getNumberingConfig(): NumberingRefConfig[] {
    return this.numberingRefs;
  }

  private createBulletNumbering(): NumberingRefConfig {
    return {
      reference: BULLET_REFERENCE,
      levels: Array.from({ length: 9 }, (_unused, level) => ({
        level,
        format: LevelFormat.BULLET,
        text: '•',
        alignment: 'left' as const,
        style: {
          paragraph: {
            indent: {
              left: 720 + level * 360,
              hanging: 360,
            },
          },
        },
      })),
    };
  }

  private createOrderedNumbering(reference: string): NumberingRefConfig {
    return {
      reference,
      levels: Array.from({ length: 9 }, (_unused, level) => ({
        level,
        format: LevelFormat.DECIMAL,
        text: `%${level + 1}.`,
        alignment: 'left' as const,
        style: {
          paragraph: {
            indent: {
              left: 720 + level * 360,
              hanging: 360,
            },
          },
        },
      })),
    };
  }

  private nextOrderedReference(): string {
    this.orderedListIndex += 1;
    const reference = `mdv-ordered-list-${this.orderedListIndex}`;
    this.numberingRefs.push(this.createOrderedNumbering(reference));
    return reference;
  }

  private async convertChildren(parent: ParentNode): Promise<DocxBlock[]> {
    const blocks: DocxBlock[] = [];

    for (const node of Array.from(parent.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = normalizeText(node.textContent ?? '');
        if (!text.trim()) {
          continue;
        }
        blocks.push(new Paragraph({ children: [new TextRun({ text })] }));
        continue;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      const element = node as HTMLElement;
      blocks.push(...(await this.convertElement(element)));
    }

    return blocks;
  }

  private async convertElement(element: HTMLElement): Promise<DocxBlock[]> {
    const tag = element.tagName.toLowerCase();

    if (tag in headingByTag) {
      const heading = headingByTag[tag];
      const runs = await this.convertInlineNodes(Array.from(element.childNodes));
      return [
        new Paragraph({
          heading,
          spacing: { before: 180, after: 140 },
          children: runs.length > 0 ? runs : [new TextRun('')],
        }),
      ];
    }

    switch (tag) {
      case 'p': {
        const runs = await this.convertInlineNodes(Array.from(element.childNodes));
        return [
          new Paragraph({
            spacing: { after: 120 },
            children: runs.length > 0 ? runs : [new TextRun('')],
          }),
        ];
      }
      case 'pre': {
        return this.convertPreformattedBlock(element);
      }
      case 'blockquote': {
        return this.convertBlockquote(element);
      }
      case 'ul':
      case 'ol': {
        return this.convertList(element as HTMLUListElement | HTMLOListElement, 0);
      }
      case 'table': {
        const table = await this.convertTable(element as HTMLTableElement);
        return table ? [table] : [];
      }
      case 'img': {
        return [await this.createImageParagraph(element as HTMLImageElement)];
      }
      case 'hr': {
        return [
          new Paragraph({
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
            },
            spacing: { before: 120, after: 120 },
            children: [new TextRun('')],
          }),
        ];
      }
      default: {
        if (tag === 'div' || tag === 'section' || tag === 'article') {
          const nested = await this.convertChildren(element);
          return nested;
        }

        const hasBlockChildren = Array.from(element.children).some((child) =>
          BLOCK_TAGS.has(child.tagName.toLowerCase())
        );
        if (hasBlockChildren) {
          return this.convertChildren(element);
        }

        const runs = await this.convertInlineNodes(Array.from(element.childNodes));
        if (runs.length === 0) {
          return [];
        }

        return [
          new Paragraph({
            spacing: { after: 120 },
            children: runs,
          }),
        ];
      }
    }
  }

  private async convertPreformattedBlock(element: HTMLElement): Promise<DocxBlock[]> {
    const codeNode = element.querySelector('code');
    const codeText = (codeNode?.textContent ?? element.textContent ?? '').replace(/\r\n/g, '\n');
    const lines = codeText.split('\n');

    const paragraphs = lines.map(
      (line, index) =>
        new Paragraph({
          spacing: {
            before: index === 0 ? 140 : 0,
            after: index === lines.length - 1 ? 140 : 0,
          },
          indent: { left: 240, right: 120 },
          shading: {
            fill: 'F8FAFC',
            type: ShadingType.CLEAR,
          },
          children: [
            new TextRun({
              text: line || ' ',
              font: CODE_FONT,
              size: 20,
            }),
          ],
        })
    );

    return paragraphs;
  }

  private async convertBlockquote(element: HTMLElement): Promise<DocxBlock[]> {
    const directParagraphs = Array.from(element.children).filter(
      (child) => child.tagName.toLowerCase() === 'p'
    ) as HTMLParagraphElement[];

    if (directParagraphs.length > 0) {
      const result: DocxBlock[] = [];
      for (const paragraph of directParagraphs) {
        const runs = await this.convertInlineNodes(Array.from(paragraph.childNodes));
        result.push(
          new Paragraph({
            spacing: { before: 90, after: 90 },
            indent: { left: 360 },
            border: {
              left: { style: BorderStyle.SINGLE, size: 8, color: '94A3B8' },
            },
            children: runs.length > 0 ? runs : [new TextRun('')],
          })
        );
      }
      return result;
    }

    const text = normalizeText(element.textContent ?? '').trim();
    if (!text) {
      return [];
    }

    return [
      new Paragraph({
        spacing: { before: 90, after: 90 },
        indent: { left: 360 },
        border: {
          left: { style: BorderStyle.SINGLE, size: 8, color: '94A3B8' },
        },
        children: [new TextRun({ text })],
      }),
    ];
  }

  private async convertList(
    list: HTMLUListElement | HTMLOListElement,
    level: number,
    orderedReference?: string
  ): Promise<DocxBlock[]> {
    const isOrdered = list.tagName.toLowerCase() === 'ol';
    const reference = isOrdered ? orderedReference ?? this.nextOrderedReference() : BULLET_REFERENCE;
    const blocks: DocxBlock[] = [];
    const listItems = Array.from(list.children).filter((child) => child.tagName.toLowerCase() === 'li');

    for (const li of listItems) {
      const item = li as HTMLLIElement;
      const inlineNodes = Array.from(item.childNodes).filter(
        (child) =>
          !(
            child.nodeType === Node.ELEMENT_NODE &&
            ['ul', 'ol'].includes((child as HTMLElement).tagName.toLowerCase())
          )
      );
      const runs = await this.convertInlineNodes(inlineNodes);

      blocks.push(
        new Paragraph({
          numbering: {
            reference,
            level: Math.min(level, 8),
          },
          spacing: { after: 60 },
          children: runs.length > 0 ? runs : [new TextRun('')],
        })
      );

      const nestedLists = Array.from(item.children).filter((child) =>
        ['ul', 'ol'].includes(child.tagName.toLowerCase())
      );
      for (const nested of nestedLists) {
        const nestedIsOrdered = nested.tagName.toLowerCase() === 'ol';
        const nestedRef = nestedIsOrdered && isOrdered ? reference : undefined;
        blocks.push(
          ...(await this.convertList(
            nested as HTMLUListElement | HTMLOListElement,
            level + 1,
            nestedRef
          ))
        );
      }
    }

    return blocks;
  }

  private async convertTable(tableElement: HTMLTableElement): Promise<Table | null> {
    const rows = Array.from(tableElement.rows);
    if (rows.length === 0) {
      return null;
    }

    const columnCount = rows.reduce((max, row) => Math.max(max, row.cells.length), 0);
    if (columnCount === 0) {
      return null;
    }

    const columnWidth = Math.floor(PAGE_WIDTH_DXA / columnCount);
    const docxRows: DocxTableRow[] = [];

    for (const [rowIndex, row] of rows.entries()) {
      const cells: DocxTableCell[] = [];
      const isHeaderRow = rowIndex === 0 && Array.from(row.cells).some((cell) => cell.tagName === 'TH');

      for (let col = 0; col < columnCount; col += 1) {
        const sourceCell = row.cells.item(col);
        const isHeaderCell = sourceCell?.tagName === 'TH' || isHeaderRow;
        const runs = sourceCell
          ? await this.convertInlineNodes(Array.from(sourceCell.childNodes), {
              bold: isHeaderCell || undefined,
            })
          : [];

        cells.push(
          new TableCell({
            width: { size: columnWidth, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
              left: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
            },
            shading: isHeaderCell
              ? {
                  fill: 'F1F5F9',
                  type: ShadingType.CLEAR,
                }
              : undefined,
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: runs.length > 0 ? runs : [new TextRun('')],
              }),
            ],
          })
        );
      }

      docxRows.push(
        new TableRow({
          tableHeader: isHeaderRow,
          children: cells,
        })
      );
    }

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: Array.from({ length: columnCount }, () => columnWidth),
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      rows: docxRows,
    });
  }

  private async createImageParagraph(image: HTMLImageElement): Promise<Paragraph> {
    const children = await this.convertImageToChildren(image);
    return new Paragraph({
      spacing: { before: 120, after: 120 },
      children,
    });
  }

  private async convertInlineNodes(
    nodes: Node[],
    style: InlineStyleState = {}
  ): Promise<ParagraphChild[]> {
    const children: ParagraphChild[] = [];

    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = normalizeText(node.textContent ?? '');
        if (!text) {
          continue;
        }
        children.push(
          new TextRun({
            text,
            bold: style.bold,
            italics: style.italics,
            strike: style.strike,
            font: style.inlineCode ? CODE_FONT : undefined,
            size: style.inlineCode ? 20 : undefined,
          })
        );
        continue;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();

      if (tag === 'br') {
        children.push(new TextRun({ text: ' ' }));
        continue;
      }

      if (tag === 'img') {
        children.push(...(await this.convertImageToChildren(element as HTMLImageElement)));
        continue;
      }

      if (tag === 'a') {
        const href = resolveHyperlink((element as HTMLAnchorElement).getAttribute('href'));
        const linkChildren = await this.convertInlineNodes(Array.from(element.childNodes), style);

        if (!href) {
          children.push(...linkChildren);
          continue;
        }

        children.push(
          new ExternalHyperlink({
            link: href,
            children:
              linkChildren.length > 0
                ? linkChildren
                : [new TextRun({ text: href, underline: {}, color: '2563EB' })],
          })
        );
        continue;
      }

      const nextStyle = { ...style };
      if (tag === 'strong' || tag === 'b') {
        nextStyle.bold = true;
      } else if (tag === 'em' || tag === 'i') {
        nextStyle.italics = true;
      } else if (tag === 'del' || tag === 's' || tag === 'strike') {
        nextStyle.strike = true;
      } else if (tag === 'code') {
        nextStyle.inlineCode = true;
      }

      children.push(...(await this.convertInlineNodes(Array.from(element.childNodes), nextStyle)));
    }

    return children;
  }

  private async convertImageToChildren(image: HTMLImageElement): Promise<ParagraphChild[]> {
    const src = image.getAttribute('src')?.trim();
    const alt = image.getAttribute('alt')?.trim() || 'image';
    if (!src) {
      return [new TextRun({ text: '[Image unavailable: missing source]', italics: true })];
    }

    try {
      const imageData = await loadImageData(src);
      if (!imageData) {
        throw new Error('Unsupported image type');
      }

      const width = Number(image.getAttribute('width')) || image.naturalWidth || MAX_IMAGE_WIDTH;
      const height = Number(image.getAttribute('height')) || image.naturalHeight || 320;
      const scaled = fitWithinMaxWidth(width, height, MAX_IMAGE_WIDTH);

      return [
        new ImageRun({
          type: imageData.type,
          data: imageData.data,
          transformation: {
            width: scaled.width,
            height: scaled.height,
          },
          altText: {
            title: alt,
            description: alt,
            name: alt,
          },
        }),
      ];
    } catch {
      const fallback = alt || src;
      return [new TextRun({ text: `[Image unavailable: ${fallback}]`, italics: true })];
    }
  }
}

function normalizeText(value: string): string {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');
}

function resolveHyperlink(rawHref: string | null): string | null {
  if (!rawHref) {
    return null;
  }

  try {
    const url = new URL(rawHref, window.location.href);
    if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:') {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

function fitWithinMaxWidth(width: number, height: number, maxWidth: number): {
  width: number;
  height: number;
} {
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    return { width: maxWidth, height: Math.round(maxWidth * 0.6) };
  }

  if (width <= maxWidth) {
    return { width: Math.round(width), height: Math.round(height) };
  }

  const ratio = maxWidth / width;
  return {
    width: maxWidth,
    height: Math.max(1, Math.round(height * ratio)),
  };
}

function getImageTypeFromMime(mime: string): 'png' | 'jpg' | 'gif' | 'bmp' | null {
  const type = mime.toLowerCase();
  if (type.includes('png')) return 'png';
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  if (type.includes('gif')) return 'gif';
  if (type.includes('bmp')) return 'bmp';
  return null;
}

function getImageTypeFromPath(path: string): 'png' | 'jpg' | 'gif' | 'bmp' | null {
  const match = path.toLowerCase().match(/\.(png|jpg|jpeg|gif|bmp)(?=([?#].*)?$)/);
  if (!match) {
    return null;
  }
  if (match[1] === 'jpeg') {
    return 'jpg';
  }
  return match[1] as 'png' | 'jpg' | 'gif' | 'bmp';
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function loadImageData(
  rawSrc: string
): Promise<{ data: Uint8Array; type: 'png' | 'jpg' | 'gif' | 'bmp' } | null> {
  const dataUriMatch = rawSrc.match(/^data:(image\/[a-zA-Z0-9.+-]+)(;base64)?,(.+)$/);
  if (dataUriMatch) {
    const mime = dataUriMatch[1] ?? '';
    const type = getImageTypeFromMime(mime);
    if (!type) {
      return null;
    }

    const payload = dataUriMatch[3] ?? '';
    const data =
      dataUriMatch[2] === ';base64'
        ? decodeBase64(payload)
        : new TextEncoder().encode(decodeURIComponent(payload));
    return { data, type };
  }

  const sourceUrl = new URL(rawSrc, window.location.origin).toString();
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Image fetch failed (${response.status})`);
  }

  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const data = new Uint8Array(buffer);
  const type = getImageTypeFromMime(blob.type) ?? getImageTypeFromPath(sourceUrl);
  if (!type) {
    return null;
  }

  return { data, type };
}

export async function buildDocxBlobFromPreview(previewElement: HTMLElement): Promise<Blob> {
  const clonedPreview = previewElement.cloneNode(true) as HTMLElement;
  clonedPreview.querySelectorAll('[data-no-export]').forEach((node) => node.remove());
  const contentRoot =
    clonedPreview.firstElementChild instanceof HTMLElement
      ? clonedPreview.firstElementChild
      : clonedPreview;

  const converter = new DocxPreviewConverter();
  const blocks = await converter.convertContent(contentRoot);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: BODY_FONT,
            size: 22,
            color: '0F172A',
          },
          paragraph: {
            spacing: {
              after: 120,
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: BODY_FONT, size: 34, bold: true, color: '0F172A' },
          paragraph: { spacing: { before: 260, after: 180 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: BODY_FONT, size: 30, bold: true, color: '0F172A' },
          paragraph: { spacing: { before: 220, after: 160 }, outlineLevel: 1 },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: BODY_FONT, size: 28, bold: true, color: '0F172A' },
          paragraph: { spacing: { before: 200, after: 140 }, outlineLevel: 2 },
        },
        {
          id: 'Heading4',
          name: 'Heading 4',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: BODY_FONT, size: 26, bold: true, color: '1E293B' },
          paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 3 },
        },
        {
          id: 'Heading5',
          name: 'Heading 5',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: BODY_FONT, size: 24, bold: true, color: '334155' },
          paragraph: { spacing: { before: 160, after: 120 }, outlineLevel: 4 },
        },
        {
          id: 'Heading6',
          name: 'Heading 6',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: BODY_FONT, size: 22, bold: true, color: '475569' },
          paragraph: { spacing: { before: 140, after: 120 }, outlineLevel: 5 },
        },
      ],
    },
    numbering: {
      config: converter.getNumberingConfig(),
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: blocks,
      },
    ],
  });

  return Packer.toBlob(doc);
}
