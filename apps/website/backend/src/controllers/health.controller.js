export const healthController = {
  getHealth: (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: "ok",
      },
    });
  },
};
