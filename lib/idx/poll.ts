/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { proceed } from './proceed';

import { 
  IdxPollOptions,
  IdxStatus,
  IdxTransaction,
  OktaAuth,
} from '../types';

export async function poll(authClient: OktaAuth, options: IdxPollOptions = {}): Promise<IdxTransaction> {
  if (Number.isInteger(options.refresh)) {
    return new Promise(function (resolve, reject) {
      setTimeout(async function () {
        try {
          let transaction = await proceed(authClient, {
            startPolling: true
          });
          if (transaction.error) {
            reject(transaction);
          } else if (transaction.status === IdxStatus.PENDING) {
            resolve(poll(authClient, options));
          } else {
            resolve(transaction);
          }
        } catch (err) {
          reject(err);
        }
      }, options.refresh);
    });
  } else {
    return proceed(authClient, {
      startPolling: true
    });
  }
}