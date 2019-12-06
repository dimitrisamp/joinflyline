#!/usr/bin/env python3

import asyncio
import time

import aiohttp

START = time.monotonic()


class RateLimiter:
    """Rate limits an HTTP client that would make get() and post() calls.

    Calls are rate-limited by host.
    https://quentin.pradet.me/blog/how-do-you-rate-limit-calls-with-aiohttp.html
    This class is not thread-safe."""

    def __init__(self, client, rate, tokens):
        self.client = client
        self.max_tokens = tokens
        self.tokens = tokens
        self.rate = rate
        self.updated_at = time.monotonic()

    async def get(self, *args, **kwargs):
        await self.wait_for_token()
        return await self.client.get(*args, **kwargs)

    async def wait_for_token(self):
        while self.tokens < 1:
            self.add_new_tokens()
            await asyncio.sleep(0.1)
        self.tokens -= 1

    def add_new_tokens(self):
        now = time.monotonic()
        time_since_update = now - self.updated_at
        new_tokens = time_since_update * self.rate
        if self.tokens + new_tokens >= 1:
            self.tokens = min(self.tokens + new_tokens, self.max_tokens)
            self.updated_at = now

