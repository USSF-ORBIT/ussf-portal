# How to manually trigger a Happo comparison

## Pre-requisite

You will need to have a Happo key set in your `.envrc.local` for the ussf-portal-client repository before the following will work.

```sh
export HAPPO_API_KEY=*******
export HAPPO_API_SECRET=*******
```

You can find these values in the team 1Password valut under `Happo API Keys`

## Step 1: Get the 2 SHAs you want to compare

You will need the SHAs of two branches you want to compare. Typically one will be main. You can use `git show` to help here.

For example to get the current SHA for current branch
```sh
> git show
commit 38bbb0ad11563673f6980b36011dcc0f9de1d797 (HEAD -> sc-1818-error-action, origin/sc-1818-error-action)
Author: John Gedeon <john@truss.works>
Date:   Wed Apr 12 11:23:05 2023 -0700

    test: update test to match new page structure

diff --git a/src/__tests__/pages/500.test.tsx b/src/__tests__/pages/500.test.tsx
index 6afcd0f..9814393 100644
--- a/src/__tests__/pages/500.test.tsx
+++ b/src/__tests__/pages/500.test.tsx
@@ -31,11 +31,11 @@ describe('500 page', () => {

   it('renders the custom 500 page,', () => {
     expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('500')
-    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
+    expect(screen.getByTestId('gridContainer')).toHaveTextContent(
       'Houston, we have a problem'
     )
-    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
-      'That’s an internal server error. While we work on fixing that, let’s get you back to business. You may also submit a report to us at'
+    expect(screen.getByTestId('gridContainer')).toHaveTextContent(
+      'That’s an internal server error. While we work on fixing that, let’s get you back to business.You may also submit a report to us at'
     )
   })

```

For main you can do this without switching branches:
```sh
> git fetch origin
> git show origin/main
commit b0cac8b8f17ffd1c9f56cb4af3fa8af38aa15c31 (HEAD -> main, origin/main, origin/HEAD)
Author: Abigail Young <abbyoung@gmail.com>
Date:   Mon Apr 10 18:02:47 2023 -0700

    chore: Update tests for new default widgets (#247)

    * reorder add/remove for default widgets

diff --git a/e2e/playwright/feature/featured-shortcuts.spec.ts b/e2e/playwright/feature/featured-shortcuts.spec.ts
index 4363e30..e81a227 100644
--- a/e2e/playwright/feature/featured-shortcuts.spec.ts
+++ b/e2e/playwright/feature/featured-shortcuts.spec.ts
@@ -28,21 +28,21 @@ test('can add/remove Featured Shortcuts section to My Space', async ({

   await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()

+  // Remove Default Featured Shortcuts
+  await page.locator('[aria-label="Section Settings"]').first().click()
+  await page.locator('text=Remove Featured Shortcuts section').click()
+  await page.locator('[data-testid="modalFooter"] >> text=Delete').click()
+
+  await expect(page.locator('Featured Apps')).toBeHidden()
+
   // Add Featured Shortcuts to My Space
-  await page.locator('text=Add section').click()
+  await page.locator('[aria-label="Add section"]').click()
   await page.locator('text=Add Featured Shortcuts section').click()

   await expect(page.locator('text=Featured Shortcuts')).toBeVisible()

   // Cannot add Featured Shortcuts twice
-  await page.locator('text=Add section').click()
+  await page.locator('[aria-label="Add section"]').click()
   const button = page.locator('text=Add Featured Shortcuts section')
   await expect(button).toBeDisabled()
-
-  // Remove Featured Shortcuts
-  await page.locator('[aria-label="Section Settings"]').first().click()
-  await page.locator('text=Remove Featured Shortcuts section').click()
-  await page.locator('[data-testid="modalFooter"] >> text=Delete').click()
-
-  await expect(page.locator('Featured Apps')).toBeHidden()
 })
...
```

## Step 2: Generate Happo snapshots for each branch

You will need to generate the snapshots for the comparisons one branch at a time. We can use the `yarn happo run SHA` command

```sh
> yarn happo run b0cac8b8f17ffd1c9f56cb4af3fa8af38aa15c31
...
> yarn happo run 38bbb0ad11563673f6980b36011dcc0f9de1d797
...
```

## Step 3: Have Happo compare the snapshots for the two branches

Once the previous commands are complete you can then ask Happo to compare the two with the `yarn happo compare SHA1 SHA2` command

```sh
> yarn happo compare b0cac8b8f17ffd1c9f56cb4af3fa8af38aa15c31 38bbb0ad11563673f6980b36011dcc0f9de1d797
```

Once this completes the PR you were trying to unblock should have the new status automatically show up.
