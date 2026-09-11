const PaymentSetting = require("../../model/paymentSettingModel");

const shapeSetting = (s) => ({
  _id: s.id,
  id: s.id,
  method: s.method,
  qrImage: s.qr_image,
  accountName: s.account_name,
  accountNumber: s.account_number,
  instructions: s.instructions,
  createdAt: s.created_at,
  updatedAt: s.updated_at,
});

const isImageUrl = (value) =>
  typeof value === "string" && /^https?:\/\/.+/i.test(value);

exports.getPaymentSettings = async (req, res) => {
  try {
    const rows = await PaymentSetting.findAll();
    res
      .status(200)
      .json({ total: rows.length, data: rows.map(shapeSetting) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentSetting = async (req, res) => {
  try {
    const { method } = req.params;
    if (!PaymentSetting.METHODS.includes(method)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }
    const existing = await PaymentSetting.findByMethod(method);
    if (!existing) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    const body = req.body || {};
    const patch = {};
    if (body.qrImage !== undefined) {
      if (body.qrImage !== "" && !isImageUrl(body.qrImage)) {
        return res
          .status(400)
          .json({ message: "QR image must be a valid image URL" });
      }
      patch.qr_image = body.qrImage;
    }
    if (body.accountName !== undefined) patch.account_name = body.accountName;
    if (body.accountNumber !== undefined)
      patch.account_number = body.accountNumber;
    if (body.instructions !== undefined) patch.instructions = body.instructions;
    const [updated] = await PaymentSetting.update(method, patch);
    res.status(200).json({
      message: "Payment settings updated successfully",
      data: shapeSetting(updated),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
