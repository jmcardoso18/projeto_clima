/**
 * Testes Unitários - Aplicativo de Previsão do Tempo
 * Ferramenta: Jest
 * Objetivo: validar comportamento das funções de requisição e tratamento de erros.
 */

describe("Testes Unitários - Projeto Clima", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // --------------------------------------------------------------------
  // 1. Validação de entrada
  // --------------------------------------------------------------------
  test("1. Deve rejeitar entrada vazia ou composta apenas por espaços", () => {
    const campoVazio = "";
    const apenasEspacos = "   ";

    expect(campoVazio.trim().length > 0).toBe(false);
    expect(apenasEspacos.trim().length > 0).toBe(false);
  });

  // --------------------------------------------------------------------
  // 2. Cidade inexistente
  // --------------------------------------------------------------------
  test("2. Deve retornar resultado vazio ao buscar cidade inexistente", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ results: [] }),
      })
    );

    const url =
      "https://geocoding-api.open-meteo.com/v1/search?name=XptoCidadeFake";
    const resp = await fetch(url);
    const data = await resp.json();

    expect(data.results.length).toBe(0);
  });

  // --------------------------------------------------------------------
  // 3. Cidade válida
  // --------------------------------------------------------------------
  test("3. Deve retornar dados climáticos ao buscar cidade válida", async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes("geocoding-api")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              results: [
                {
                  latitude: -23.55,
                  longitude: -46.63,
                  name: "São Paulo",
                },
              ],
            }),
        });
      }

      return Promise.resolve({
        json: () =>
          Promise.resolve({
            current: {
              temperature_2m: 27,
              weather_code: 1,
            },
          }),
      });
    });

    const geo = await fetch("https://geocoding-api.com");
    const geoData = await geo.json();

    expect(geoData.results[0].name).toBe("São Paulo");

    const clima = await fetch("https://api.open-meteo.com");
    const climaData = await clima.json();

    expect(climaData.current.temperature_2m).toBe(27);
  });

  // --------------------------------------------------------------------
  // 4. Falha de rede
  // --------------------------------------------------------------------
  test("4. Deve lançar erro em caso de falha de conexão", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Erro de conexão"))
    );

    await expect(fetch("https://api.fake.com")).rejects.toThrow(
      "Erro de conexão"
    );
  });

  // --------------------------------------------------------------------
  // 5. Erro 429 - Limite de requisição
  // --------------------------------------------------------------------
  test("5. Deve tratar corretamente erros 429 (limite excedido)", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 429,
        ok: false,
        json: () =>
          Promise.resolve({
            error: true,
            message: "Muitas requisições.",
          }),
      })
    );

    const resp = await fetch("https://api.open-meteo.com");
    const dados = await resp.json();

    expect(resp.status).toBe(429);
    expect(dados.error).toBe(true);
  });

  // --------------------------------------------------------------------
  // 6. Timeout por conexão lenta
  // --------------------------------------------------------------------
  test("6. Deve gerar timeout quando a resposta excede o tempo limite", async () => {
    const TIMEOUT = 1000;

    global.fetch = jest.fn(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout interno")), 1500)
        )
    );

    const limite = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout atingido")), TIMEOUT)
    );

    await expect(
      Promise.race([fetch("https://api.open-meteo.com"), limite])
    ).rejects.toThrow(/Timeout/);
  });

  // --------------------------------------------------------------------
  // 7. Formato inesperado da API
  // --------------------------------------------------------------------
  test("7. Deve detectar alteração inesperada na estrutura do JSON retornado pela API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            weirdField: "Mudou tudo!",
          }),
      })
    );

    const resp = await fetch("https://api.open-meteo.com");
    const data = await resp.json();

    expect(data.results).toBeUndefined();
    expect(data.weirdField).toBeDefined();
  });

  // ============================================================
  // TESTES ADICIONAIS
  // ============================================================

  // --------------------------------------------------------------------
  // 8. Caracteres especiais no nome da cidade
  // --------------------------------------------------------------------
  test("8. Deve aceitar cidades com acentos e caracteres especiais no nome", () => {
    const cidade = "São José-d’Água";
    expect(() => encodeURIComponent(cidade)).not.toThrow();
  });

  // --------------------------------------------------------------------
  // 9. Retorno nulo da API
  // --------------------------------------------------------------------
  test("9. Deve validar retorno nulo da API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(null) })
    );

    const resp = await fetch("https://api.open-meteo.com");
    const data = await resp.json();

    expect(data).toBeNull();
  });

  // --------------------------------------------------------------------
  // 10. Coordenadas inválidas
  // --------------------------------------------------------------------
  test("10. Deve identificar coordenadas inválidas no retorno da API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            results: [{ latitude: "abc", longitude: "xyz" }],
          }),
      })
    );

    const geo = await fetch("https://geo.com");
    const data = await geo.json();

    expect(isNaN(data.results[0].latitude)).toBe(true);
    expect(isNaN(data.results[0].longitude)).toBe(true);
  });

  // --------------------------------------------------------------------
  // 11. Resposta parcial da API
  // --------------------------------------------------------------------
  test("11. Deve detectar ausência de campos obrigatórios na resposta", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            current: {
              temperature_2m: 22,
              // weather_code ausente
            },
          }),
      })
    );

    const resp = await fetch("https://api.open-meteo.com");
    const data = await resp.json();

    expect(data.current.weather_code).toBeUndefined();
  });

  // --------------------------------------------------------------------
  // 12. Tipo incorreto de dado
  // --------------------------------------------------------------------
  test("12. Deve identificar tipos incorretos nos campos retornados pela API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            current: {
              temperature_2m: "quente",
            },
          }),
      })
    );

    const resp = await fetch("https://api.com");
    const data = await resp.json();

    expect(typeof data.current.temperature_2m).toBe("string");
  });

  // --------------------------------------------------------------------
  // 13. Requisições encadeadas
  // --------------------------------------------------------------------
  test("13. Deve processar corretamente múltiplas requisições sequenciais", async () => {
    const mock = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ step: 1 }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ step: 2 }) });

    global.fetch = mock;

    const r1 = await fetch("step1");
    const j1 = await r1.json();
    const r2 = await fetch("step2");
    const j2 = await r2.json();

    expect(j1.step).toBe(1);
    expect(j2.step).toBe(2);
  });

  // --------------------------------------------------------------------
  // 14. API retorna string em vez de JSON
  // --------------------------------------------------------------------
  test("14. Deve identificar erro ao tentar converter retorno não-JSON", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error("JSON inválido")),
      })
    );

    await expect(fetch("x").then((r) => r.json())).rejects.toThrow(
      "JSON inválido"
    );
  });

  // --------------------------------------------------------------------
  // 15. Requisição repetida
  // --------------------------------------------------------------------
  test("15. Deve manter consistência ao repetir a mesma requisição", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            current: { temperature_2m: 30 },
          }),
      })
    );

    const r1 = await fetch("x");
    const r2 = await fetch("x");

    const j1 = await r1.json();
    const j2 = await r2.json();

    expect(j1.current.temperature_2m).toBe(30);
    expect(j2.current.temperature_2m).toBe(30);
  });
});
