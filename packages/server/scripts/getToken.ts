import { connectDatabase } from '../src/database';
import { generateToken } from '../src/auth';

import { getOrCreateRelayUser } from './getOrCreateRelayUser';

(async () => {
  try {
    await connectDatabase();

    const user = await getOrCreateRelayUser();

    // eslint-disable-next-line
    console.log({
      token: generateToken(user),
    });
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
})();
