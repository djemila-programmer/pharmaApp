import bcrypt from "bcryptjs";

const run = async () => {
  const adminHash = await bcrypt.hash("admin@123", 10);
  const pharmaHash = await bcrypt.hash("pharma!456", 10);

  console.log("ADMIN HASH:", adminHash);
  console.log("PHARMA HASH:", pharmaHash);
};

run();
