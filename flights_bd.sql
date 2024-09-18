-- Tabela Localidades:
CREATE TABLE localidade (
  id SERIAL PRIMARY KEY,
  cep VARCHAR(9) NOT NULL,
  pais VARCHAR(50) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL
);

-- Tabela Voos:
CREATE TABLE voo (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(15) UNIQUE NOT NULL,
  origem_id INT REFERENCES localidades(id),
  destino_id INT REFERENCES localidades(id),
  data TIMESTAMP NOT NULL,
  CONSTRAINT chk_diff_tempo CHECK (data > NOW() + INTERVAL '30 minutes')
);

--Trigger para Verificação de Vôos Duplicados
CREATE OR REPLACE FUNCTION verifica_destino_repetido()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM voos 
        WHERE destino_id = NEW.destino_id 
        AND DATE(data) = DATE(NEW.data)
    ) THEN
        RAISE EXCEPTION 'Não é permitido ter dois voos para o mesmo destino no mesmo dia';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_verifica_destino_repetido
BEFORE INSERT OR UPDATE ON voos
FOR EACH ROW EXECUTE FUNCTION verifica_destino_repetido();