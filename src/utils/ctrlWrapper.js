export function ctrlWrapper(controller) {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      console.error('❌ Помилка в loginController:', error);
      next(error);
    }
  };
}
