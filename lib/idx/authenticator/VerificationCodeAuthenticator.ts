import { Authenticator } from './Authenticator';

type VerificationCodeCredentials = {
  passcode: string;
  totp?: never;
} | {
  passcode?: never;
  totp: string;
}

// general authenticator to handle "verificationCode" input
// it can be used for "email", "phone", "google authenticator"
// a new authenticator class should be created if special cases need to be handled
export class VerificationCodeAuthenticator extends Authenticator {
  canVerify(values) {
    return !!values.verificationCode;
  }

  mapCredentials(values): VerificationCodeCredentials {
    return { passcode: values.verificationCode };
  }

  getInputs(idxRemediationValue) {
    return {
      ...idxRemediationValue.form?.value[0],
      name: 'verificationCode',
      type: 'string',
      required: idxRemediationValue.required
    };
  }
}
