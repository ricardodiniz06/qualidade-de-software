import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

/**
 * TESTES E2E ÿÿÿ Coment?rios
 */

async function loginAsNewUser(page: import('@playwright/test').Page) {
  const email = `comments.${uuidv4().substring(0, 8)}@test.com`;

  await page.request.post('http://localhost:8080/auth/signup', {
    data: { email, password: 'Forte@123' },
  });

  await page.goto('/signin');
  await page.getByRole('textbox', { name: /e-mail/i }).fill(email);
  await page.getByLabel(/senha/i).fill('Forte@123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(page).toHaveURL('/', { timeout: 10_000 });

  return email;
}

test.describe('Coment?rios nos Posts', () => {

  test('[E2E] usu?rio logado pode adicionar um coment?rio', async ({ page }) => {
    await loginAsNewUser(page);

    const commentText = `coment?rio e2e ${uuidv4().substring(0, 6)}`;

    await page.getByRole('button', { name: /coment?rios/i }).first().click();
    await page.getByPlaceholder('Escreva um coment?rio...').fill(commentText);
    await page.getByRole('button', { name: /comentar/i }).click();

    await expect(page.getByText(commentText)).toBeVisible({ timeout: 8_000 });
  });

  test('[E2E] descurtir coment?rio remove apenas a curtida e mant?m o coment?rio', async ({ page }) => {
    await loginAsNewUser(page);

    const commentText = `bug unlike ${uuidv4().substring(0, 6)}`;

    await page.getByRole('button', { name: /coment?rios/i }).first().click();
    await page.getByPlaceholder('Escreva um coment?rio...').fill(commentText);
    await page.getByRole('button', { name: /comentar/i }).click();
    await expect(page.getByText(commentText)).toBeVisible({ timeout: 8_000 });

    const commentCard = page.locator('div').filter({ hasText: commentText }).last();
    const likeButton = commentCard.getByRole('button').first();

    await likeButton.click();
    await likeButton.click();

    await expect(page.getByText(commentText)).toBeVisible({ timeout: 8_000 });
  });

});
