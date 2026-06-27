import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

/**
 * TESTES E2E - Comentarios
 */

async function loginAsNewUser(page: import('@playwright/test').Page) {
  const email = `comments.${uuidv4().substring(0, 8)}@test.com`;

  await page.request.post('http://127.0.0.1:8080/auth/signup', {
    data: { email, password: 'Forte@123' },
  });

  await page.goto('/signin');
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByLabel(/senha/i).fill('Forte@123');
  await page.getByRole('main').getByRole('button', { name: /entrar/i }).click();
  await expect(page).toHaveURL('/', { timeout: 10_000 });

  return email;
}

async function openCommentsSection(page: import('@playwright/test').Page) {
  const commentsBtn = page.getByRole('button', { name: /coment\u00e1rios/i }).first();
  await expect(commentsBtn).toBeVisible({ timeout: 15_000 });
  await commentsBtn.click();
}

test.describe('Comentarios nos Posts', () => {

  test('[E2E] usuario logado pode adicionar um comentario', async ({ page }) => {
    await loginAsNewUser(page);

    const commentText = `comentario e2e ${uuidv4().substring(0, 6)}`;

    await openCommentsSection(page);
    await page.getByPlaceholder(/Escreva um coment\u00e1rio/i).fill(commentText);
    await page.getByRole('button', { name: /^comentar$/i }).click();

    await expect(page.getByText(commentText)).toBeVisible({ timeout: 8_000 });
  });

  test('[E2E] descurtir comentario remove apenas a curtida e mantem o comentario', async ({ page }) => {
    await loginAsNewUser(page);

    const commentText = `bug unlike ${uuidv4().substring(0, 6)}`;

    await openCommentsSection(page);
    await page.getByPlaceholder(/Escreva um coment\u00e1rio/i).fill(commentText);
    await page.getByRole('button', { name: /^comentar$/i }).click();
    await expect(page.getByText(commentText)).toBeVisible({ timeout: 8_000 });

    const commentCard = page.locator('div').filter({ hasText: commentText }).last();
    const likeButton = commentCard.getByRole('button').first();

    await likeButton.click();
    await likeButton.click();

    await expect(page.getByText(commentText)).toBeVisible({ timeout: 8_000 });
  });

});
