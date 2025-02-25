import { FiltersUtil } from "./filters.util";
import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

describe('FiltersUtil', () => {
  describe('getExceptionStatus', () => {
    it('должен вернуть статус ошибки, если передан HttpException', () => {
      const exception = new HttpException('Ошибка', HttpStatus.BAD_REQUEST);
      expect(FiltersUtil.getExceptionStatus(exception)).toBe(HttpStatus.BAD_REQUEST);
    });

    it('должен вернуть INTERNAL_SERVER_ERROR, если передан неизвестный тип ошибки', () => {
      expect(FiltersUtil.getExceptionStatus(new Error('Ошибка'))).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('getExceptionMessage', () => {
    it('должен вернуть сообщение из HttpException', () => {
      const exception = new HttpException('Ошибка', HttpStatus.BAD_REQUEST);
      expect(FiltersUtil.getExceptionMessage(exception)).toBe('Ошибка');
    });

    it('должен вернуть переданное сообщение, если исключение не HttpException', () => {
      expect(FiltersUtil.getExceptionMessage(new Error(), 'Произошла ошибка')).toBe('Произошла ошибка');
    });

    it('должен вернуть стандартное сообщение, если исключение не HttpException и сообщение не передано', () => {
      expect(FiltersUtil.getExceptionMessage(new Error())).toBe(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    });
  });

  describe('getExceptionDetails', () => {
    it('должен вернуть массив сообщений, если HttpException содержит массив', () => {
      const exception = new HttpException({ message: ['Ошибка 1', 'Ошибка 2'] }, HttpStatus.BAD_REQUEST);
      expect(FiltersUtil.getExceptionDetails(exception)).toEqual(['Ошибка 1', 'Ошибка 2']);
    });

    it('должен вернуть undefined, если HttpException содержит строку', () => {
      const exception = new HttpException({ message: 'Ошибка' }, HttpStatus.BAD_REQUEST);
      expect(FiltersUtil.getExceptionDetails(exception)).toBeUndefined();
    });

    it('должен вернуть undefined, если исключение не HttpException', () => {
      expect(FiltersUtil.getExceptionDetails(new Error('Ошибка'))).toBeUndefined();
    });
  });
});