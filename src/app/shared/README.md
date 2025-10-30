# rxResourceFixed

A drop-in replacement for Angular's `rxResource()` that fixes critical bugs in Angular's experimental Resource APIs.

## Overview

`rxResourceFixed()` is a 100% API-compatible wrapper for `rxResource()` that addresses three major bugs:

1. **Value Preservation** - Keeps the previous value visible while loading new data (no flickering)
2. **Error Unwrapping** - Returns `HttpErrorResponse` directly without wrapping in `ResourceWrappedError`
3. **Reload Behavior** - Clears error state immediately when `reload()` is called

## Usage

Simply replace `rxResource` with `rxResourceFixed` in your imports and calls:

```typescript
import { rxResourceFixed } from './shared/rx-resource-fixed';

// Before
const resource = rxResource({
  request: () => ({ id: bookId() }),
  loader: ({ request }) => this.http.get<Book>(`/api/books/${request.id}`)
});

// After
const resource = rxResourceFixed({
  request: () => ({ id: bookId() }),
  loader: ({ request }) => this.http.get<Book>(`/api/books/${request.id}`)
});
```

The returned `ResourceRef<T>` has the exact same interface as the standard Angular resource, so no other code changes are needed.

## Key Differences

### Bug #1: Value Resets When Parameters Change

**Standard rxResource:**
- Sets `value()` to `undefined` immediately when parameters change
- Causes DOM to collapse and scroll position to jump
- Creates a jarring user experience with flickering content

**rxResourceFixed:**
- Preserves previous `value()` while loading new data
- Uses `isLoading()` signal to show loading indicators
- Provides smooth transitions between data states

### Bug #2: HttpErrorResponse Gets Wrapped

**Standard rxResource:**
- Wraps `HttpErrorResponse` in `ResourceWrappedError`
- Forces you to access `.cause` property to get actual error details
- Makes error handling cumbersome

**rxResourceFixed:**
- Returns `HttpErrorResponse` directly in `error()` signal
- Allows immediate access to HTTP status codes and error details
- Simplifies error handling code

### Bug #3: reload() Doesn't Clear Error State

**Standard rxResource:**
- Keeps old error visible during reload
- Shows `isLoading: true` and `hasError: true` simultaneously
- Confuses users with persistent error messages during retry

**rxResourceFixed:**
- Clears error state immediately when `reload()` is called
- Provides clear visual feedback that system is attempting to recover
- `reload()` returns `true` if successful, `false` if already loading

## Implementation Details

### Loading vs Reloading Semantics

`rxResourceFixed` distinguishes between initial/parameter-change loading and explicit reloads:

- **isLoading()**: `true` during initial load or when parameters change
- **After reload()**: Error clears immediately, loading state shows progress

This matches user expectations: parameter changes show loading indicators, but errors only clear when explicitly retrying.

### Value Stability

The `value()` signal uses a `linkedSignal` that only updates when:
1. New data successfully arrives
2. Status changes from success to loading (preserves last good value)

This ensures previous data remains visible until new data is ready, preventing DOM flickering.

## Migration Path

### Temporary Solution

Use `rxResourceFixed()` as a temporary workaround until Angular fixes these issues in the official Resource APIs.

### Future Migration

When Angular addresses these bugs (likely in a future version), you can simply:
1. Replace `rxResourceFixed` imports with `rxResource`
2. Remove the `rx-resource-fixed.ts` file
3. No other code changes needed (API-compatible interface)

## Trade-offs

**Benefits:**
- Prevents UI flickering and scroll jumps
- Simplifies error handling code
- Improves user experience during loading states
- Drop-in replacement (no refactoring needed)

**Considerations:**
- Slightly more complex internal implementation
- Requires manual updates if Angular changes `rxResource` API
- May have different behavior edge cases (though extensively tested in demos)

## Testing

See the live demos in `/src/app/pages/` for comprehensive examples:
- `bug1-value-reset` - Demonstrates value preservation
- `bug2-error-handling` - Shows unwrapped error handling
- `bug3-reload` - Illustrates proper reload behavior

Each demo shows side-by-side comparison of buggy `rxResource` vs fixed `rxResourceFixed`.

## Recommendations

**Use rxResourceFixed if:**
- You need stable UIs during parameter changes
- You want simplified error handling
- You require proper reload semantics
- You're building production apps with experimental APIs

**Stick with rxResource if:**
- You prefer official Angular APIs despite bugs
- You're willing to work around the limitations
- You can wait for Angular team to fix these issues

## Stability

Angular's Resource APIs are **experimental** and have no stability guarantees. Both `rxResource` and `rxResourceFixed` may change in future Angular versions. Use with caution in production.

## More Information

Read the full blog post: [angular.schule/blog/2025-10-rx-resource-is-broken](https://angular.schule/blog/2025-10-rx-resource-is-broken)
