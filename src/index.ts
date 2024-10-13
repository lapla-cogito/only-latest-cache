import * as core from '@actions/core';
import { run } from './main';

(async (): Promise<void> => {
    try {
        await run();
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(`failed with ${error.message}`);
        } else {
            core.setFailed('unexpected error occurred');
        }
    }
})();
