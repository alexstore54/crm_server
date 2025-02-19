export const VALIDATION_REGEX = {
  PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,20}$/,
  NAME: /^[A-Za-z\s]{1,25}$/,
};