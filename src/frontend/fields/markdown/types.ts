/* eslint-disable */

declare class EasyMDE {
  constructor(options?: EasyMDE.Options);

  value(): string;
  value(val: string): void;

  codemirror: CodeMirror.Editor;

  cleanup(): void;

  toTextArea(): void;

  isPreviewActive(): boolean;

  isSideBySideActive(): boolean;

  isFullscreenActive(): boolean;

  clearAutosavedValue(): void;

  static toggleBold: (editor: EasyMDE) => void;
  static toggleItalic: (editor: EasyMDE) => void;
  static toggleStrikethrough: (editor: EasyMDE) => void;
  static toggleHeadingSmaller: (editor: EasyMDE) => void;
  static toggleHeadingBigger: (editor: EasyMDE) => void;
  static toggleHeading1: (editor: EasyMDE) => void;
  static toggleHeading2: (editor: EasyMDE) => void;
  static toggleHeading3: (editor: EasyMDE) => void;
  static toggleHeading4: (editor: EasyMDE) => void;
  static toggleHeading5: (editor: EasyMDE) => void;
  static toggleHeading6: (editor: EasyMDE) => void;
  static toggleCodeBlock: (editor: EasyMDE) => void;
  static toggleBlockquote: (editor: EasyMDE) => void;
  static toggleUnorderedList: (editor: EasyMDE) => void;
  static toggleOrderedList: (editor: EasyMDE) => void;
  static cleanBlock: (editor: EasyMDE) => void;
  static drawLink: (editor: EasyMDE) => void;
  static drawImage: (editor: EasyMDE) => void;
  static drawUploadedImage: (editor: EasyMDE) => void;
  static drawTable: (editor: EasyMDE) => void;
  static drawHorizontalRule: (editor: EasyMDE) => void;
  static togglePreview: (editor: EasyMDE) => void;
  static toggleSideBySide: (editor: EasyMDE) => void;
  static toggleFullScreen: (editor: EasyMDE) => void;
  static undo: (editor: EasyMDE) => void;
  static redo: (editor: EasyMDE) => void;
}

export default EasyMDE;
