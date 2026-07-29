import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as fbSignOut,
  PhoneAuthProvider,
} from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import { auth } from "./firebase";

let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Khoi tao RecaptchaVerifier (can thiet cho Phone OTP)
 * Goi mot lan truoc khi gui OTP
 */
export function khoiTaoRecaptcha(containerId: string): RecaptchaVerifier {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
  return recaptchaVerifier;
}

/**
 * Gui ma OTP den so dien thoai
 * @param soDienThoai - dinh dang +84xxxxxxxxx
 * @returns ConfirmationResult de xac minh OTP
 */
export async function guiOTP(
  soDienThoai: string,
  containerId: string,
): Promise<ConfirmationResult> {
  const verifier = khoiTaoRecaptcha(containerId);
  const confirmation = await signInWithPhoneNumber(auth, soDienThoai, verifier);
  return confirmation;
}

/**
 * Xac minh ma OTP nguoi dung nhap
 */
export async function xacMinhOTP(
  confirmation: ConfirmationResult,
  maOTP: string,
) {
  const result = await confirmation.confirm(maOTP);
  return result.user;
}

/**
 * Dang xuat
 */
export async function dangXuat(): Promise<void> {
  await fbSignOut(auth);
}

export { PhoneAuthProvider };
