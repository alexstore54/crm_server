export const MEDIA_LIMITS = {
  PICTURE_MAX_FILE_SIZE: 1024 * 1024 * 5, // 5MB
  DOCUMENT_MAX_FILE_SIZE: 1024 * 1024 * 100, // 100MB
  MAX_FILE_NAME_LENGTH: 255,
};

export const MEDIA_REGEX = {
  PICTURES: /\/(jpg|jpeg|png)$/,
  DOCUMENTS: /\/(pdf|doc|docx|txt)$/,
}