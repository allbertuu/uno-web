import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

/**
 * FLuxos essenciais:
 * 1. Preencher formulário corretamente e trocar para tarefa ativa
 * 2. Preencher incorretamente, não ativar tarefa e receber mensagens de aviso
 * específica
 * 3. Todos os estados (criar tarefa, tarefa ativa) devem ser guardados em localStorage,
 * exceto vitória (caso reload, volta pra estado criar tarefa)
 */

test.skip("Page", () => {
  render(<Page />);

  expect(screen.getByText(/deploy now/i)).toBeInTheDocument();
});
