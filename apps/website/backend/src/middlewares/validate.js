export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: issue?.message || "Invalid request payload",
        },
      });
    }

    req.validated = parsed.data;
    next();
  } catch (err) {
    next(err);
  }
};
