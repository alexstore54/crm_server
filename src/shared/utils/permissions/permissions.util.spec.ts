import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { FiltersUtil } from '@/shared/utils';

describe(FiltersUtil.name, () => {
  describe(FiltersUtil.getExceptionStatus.name, () => {
    it('should return the error status if HttpException is passed', () => {
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);
      expect(FiltersUtil.getExceptionStatus(exception)).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return INTERNAL_SERVER_ERROR if an unknown error type is passed', () => {
      expect(FiltersUtil.getExceptionStatus(new Error('Error'))).toBe(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe(FiltersUtil.getExceptionMessage.name, () => {
    it('should return the message from HttpException', () => {
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);
      expect(FiltersUtil.getExceptionMessage(exception)).toBe('Error');
    });

    it('should return the passed message if the exception is not HttpException', () => {
      expect(FiltersUtil.getExceptionMessage(new Error(), 'An error occurred')).toBe(
        'An error occurred',
      );
    });

    it('should return the default message if the exception is not HttpException and no message is passed', () => {
      expect(FiltersUtil.getExceptionMessage(new Error())).toBe(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe(FiltersUtil.getExceptionDetails.name, () => {
    it('should return an array of messages if HttpException contains an array', () => {
      const exception = new HttpException(
        { message: ['Error 1', 'Error 2'] },
        HttpStatus.BAD_REQUEST,
      );
      expect(FiltersUtil.getExceptionDetails(exception)).toEqual(['Error 1', 'Error 2']);
    });

    it('should return undefined if HttpException contains a string', () => {
      const exception = new HttpException({ message: 'Error' }, HttpStatus.BAD_REQUEST);
      expect(FiltersUtil.getExceptionDetails(exception)).toBeUndefined();
    });

    it('should return undefined if the exception is not HttpException', () => {
      expect(FiltersUtil.getExceptionDetails(new Error('Error'))).toBeUndefined();
    });
  });
});