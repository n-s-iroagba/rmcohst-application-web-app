export class ApiResponseUtil {
  static success<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      statusCode,
    }
  }

  static error(message: string, statusCode: number = 500, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
      statusCode,
    }
  }
}
