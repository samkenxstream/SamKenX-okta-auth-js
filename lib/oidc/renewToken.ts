/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { AuthSdkError } from '../errors';
import { OktaAuth, Token, isToken, isAccessToken, AccessToken, IDToken, isIDToken } from '../types';
import { getWithoutPrompt } from './getWithoutPrompt';

export function renewToken(sdk: OktaAuth, token: Token): Promise<Token> {
  // Note: This is not used when a refresh token is present
  if (!isToken(token)) {
    return Promise.reject(new AuthSdkError('Renew must be passed a token with ' +
      'an array of scopes and an accessToken or idToken'));
  }

  var responseType;
  if (sdk.options.pkce) {
    responseType = 'code';
  } else if (isAccessToken(token)) {
    responseType = 'token';
  } else {
    responseType = 'id_token';
  }

  const { scopes, authorizeUrl, userinfoUrl, issuer } = token as (AccessToken & IDToken);
  return getWithoutPrompt(sdk, {
    responseType,
    scopes,
    authorizeUrl,
    userinfoUrl,
    issuer
  })
    .then(function (res) {
      // Multiple tokens may have come back. Return only the token which was requested.
      var tokens = res.tokens;
      return isIDToken(token) ? tokens.idToken : tokens.accessToken;
    });
}
