import { ValueTransformer } from "typeorm";
import * as crypto from "crypto";

export class StringTransformer implements ValueTransformer {
  private readonly secretKey: string = "mySecretKey";

  // Encrypt the value before saving it to the database
  to(value: string): string {
    if (!value) return value;
    const cipher = crypto.createCipher("aes-256-cbc", this.secretKey);
    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // Decrypt the value after retrieving it from the database
  from(value: string): string {
    console.log("Returning Raw Value from DB:", value);
    return value;

  }

  decipher(value: string): string {
    if (!value) return value;
    const decipher = crypto.createDecipher("aes-256-cbc", this.secretKey);
    let decrypted = decipher.update(value, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

}
