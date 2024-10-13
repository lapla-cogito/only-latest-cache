import { context } from '@actions/github';
import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

export async function run(): Promise<void> {
    try {
        core.info('[INFO] Usage: https://github.com/lapla-cogito/only-latest-cache#readme');

        if (core.isDebug()) {
            core.debug('[DEBUG] context dump');
            core.debug(JSON.stringify(context, null, 2));
            core.endGroup();
        }

        const key_prefix = core.getInput('key_prefix');
        core.info(`[INFO] branch: ${context.ref.replace('refs/heads/', '')}`);
        core.info(`[INFO] key_prefix: ${key_prefix}`);

        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });
        const caches = await octokit.rest.actions.getActionsCacheList.endpoint.merge({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: context.ref,
            sort: 'last_accessed_at'
        });
        const actionsCache: { id: number; ref: string; key: string }[] =
            await octokit.paginate(caches);

        if (core.isDebug()) {
            core.debug(`[DEBUG] actionsCache: ${JSON.stringify(actionsCache)}`);
        }

        if (actionsCache.length <= 1) {
            core.info(`[INFO] skip for key: ${key_prefix}`);
            return;
        }

        let deleted = 0;
        await Promise.all(
            actionsCache
                .filter((cache) => cache.key.startsWith(key_prefix))
                .map(async (cache) => {
                    if (core.isDebug()) {
                        core.debug(`[DEBUG] delete cache: ${cache.id}`);
                    }

                    deleted++;
                    return octokit.rest.actions.deleteActionsCacheById({
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        cache_id: cache.id
                    });
                })
        );

        core.info(`[INFO] deleted ${deleted} cache(s) for key prefix: ${key_prefix}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('unexpected error occurred');
        }
    }
}
