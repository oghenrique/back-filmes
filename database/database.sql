-- Criando o schema
create schema db_acme_filmes_turma_aa;

-- Usando o schema
use db_acme_filmes_turma_aa;

-- Tabela de classificação indicativa
create table tbl_classificacao (
  id int not null auto_increment primary key,
  nome varchar(45) not null,
  sigla varchar(2) not null,
  descricao varchar(300) not null,
  icone varchar(150) not null,
  
  unique key (id),
  unique index (id)
);

-- Tabela de filmes
create table tbl_filme (
  id int not null auto_increment primary key,
  titulo varchar(100) not null,
  sinopse text not null,
  data_lancamento date not null,
  data_relancamento date,
  duracao time not null,
  foto_capa varchar(150) not null,
  valor_unitario float not null,
  id_classificacao int not null,
  
  foreign key (id_classificacao) references tbl_classificacao(id),
  unique key (id),
  unique index (id)
);

-- Tabela de gêneros
create table tbl_genero (
  id int not null auto_increment primary key,
  nome varchar(45) not null,
  
  unique key (id),
  unique index (id)
);

-- Tabela intermediária entre filmes e gêneros
create table tbl_filme_genero (
  id int not null auto_increment primary key,
  id_filme int not null,
  id_genero int not null,
  
  foreign key (id_filme) references tbl_filme(id),
  foreign key (id_genero) references tbl_genero(id),
  
  unique key (id),
  unique index (id)
);

-- Tabela de sexo
create table tbl_sexo (
  id int not null auto_increment primary key,
  sigla varchar(1) not null,
  nome varchar(20) not null,
  
  unique key (id),
  unique index (id)
);

-- Tabela de nacionalidade
create table tbl_nacionalidade (
  id int not null auto_increment primary key,
  nome varchar(45) not null,
  
  unique key (id),
  unique index (id)
);

-- Tabela de atores
create table tbl_ator (
  id int not null auto_increment primary key,
  nome_completo varchar(100) not null,
  nome_artistico varchar(100) not null,
  foto varchar(150) not null,
  data_nascimento date not null,
  data_falecimento date,
  biografia text not null,
  id_sexo int not null,
  
  foreign key (id_sexo) references tbl_sexo(id),
  
  unique key (id),
  unique index (id)
);

-- Tabela de diretores
create table tbl_diretor (
  id int not null auto_increment primary key,
  nome_completo varchar(100) not null,
  nome_artistico varchar(100) not null, 
  foto varchar(150) not null,
  data_nascimento date not null,
  data_falecimento date,
  biografia text not null,
  id_sexo int not null,
  
  foreign key (id_sexo) references tbl_sexo(id),
  
  unique key (id),
  unique index (id)
);

-- Tabela intermediária entre filmes e atores
create table tbl_filme_ator (
  id int not null auto_increment primary key,
  id_filme int not null,
  id_ator int not null,
  
  foreign key (id_filme) references tbl_filme(id),
  foreign key (id_ator) references tbl_ator(id),
 
  unique key (id),
  unique index (id)
);

-- Tabela intermediária entre filmes e diretores
create table tbl_filme_diretor (
  id int not null auto_increment primary key,
  id_filme int not null,
  id_diretor int not null,
  
  foreign key (id_filme) references tbl_filme(id),
  foreign key (id_diretor) references tbl_diretor(id),
  
  unique key (id),
  unique index (id)
);

-- Tabela de nacionalidade para atores
create table tbl_nacionalidade_ator (
  id int not null auto_increment primary key,
  id_ator int not null,
  id_nacionalidade int not null,
  
  foreign key (id_ator) references tbl_ator(id),
  foreign key (id_nacionalidade) references tbl_nacionalidade(id),
  
  unique key (id),
  unique index (id)
);

-- Tabela de nacionalidade para diretores
create table tbl_nacionalidade_diretor (
  id int not null auto_increment primary key,
  id_diretor int not null,
  id_nacionalidade int not null,
  
  foreign key (id_diretor) references tbl_diretor(id),
  foreign key (id_nacionalidade) references tbl_nacionalidade(id),
  
  unique key (id),
  unique index (id)
);

-- Definindo um delimitador personalizado
DELIMITER $

-- Criando o trigger para exclusão de ator
CREATE TRIGGER tgr_del_ator
    BEFORE DELETE ON tbl_ator
    FOR EACH ROW
BEGIN
    -- Remover nacionalidade do ator
    DELETE FROM tbl_nacionalidade_ator WHERE id_ator = old.id;

    -- Remover associações do ator em filmes
    DELETE FROM tbl_filme_ator WHERE id_ator = old.id;
END $

-- Criando o trigger para exclusão de diretor
CREATE TRIGGER tgr_del_diretor
    BEFORE DELETE ON tbl_diretor
    FOR EACH ROW
BEGIN
    -- Remover nacionalidade do diretor
    DELETE FROM tbl_nacionalidade_diretor WHERE id_diretor = old.id;

    -- Remover associações do diretor em filmes
    DELETE FROM tbl_filme_diretor WHERE id_diretor = old.id;
END $

-- Criando o trigger para exclusão de gênero de filme
CREATE TRIGGER tgr_del_genero
    BEFORE DELETE ON tbl_genero
    FOR EACH ROW
BEGIN
    -- Remover associações do gênero em filmes
    DELETE FROM tbl_filme_genero WHERE id_genero = old.id;
END $

-- Criando o trigger para exclusão de filme
CREATE TRIGGER tgr_del_filme
    BEFORE DELETE ON tbl_filme
    FOR EACH ROW
BEGIN
    -- Remover diretores associados ao filme
    DELETE FROM tbl_filme_diretor WHERE id_filme = old.id;

    -- Remover gêneros associados ao filme
    DELETE FROM tbl_filme_genero WHERE id_filme = old.id;

    -- Remover atores associados ao filme
    DELETE FROM tbl_filme_ator WHERE id_filme = old.id;
END $

-- Restaurando o delimitador padrão
DELIMITER ;