create schema db_acme_filmes_turma_aa;

use db_acme_filmes_turma_aa;


create table tbl_filme (
id integer not null auto_increment primary key,
nome varchar(80) not null,
sinopse text not null,
duracao time not null,
data_lancamento date not null,
data_relancamento date,
foto_capa varchar(300) not null,
valor_unitario float,

unique key (id),
unique index (id)
);

insert into tbl_filme (nome,
						sinopse,
                        duracao,
                        data_lancamento,
                        data_relancamento,
                        foto_capa,
                        valor_unitario
						) values (
                        'Jogos Vorazes',
                        'Num futuro distante, boa parte da população é controlada por um regime totalitário, que relembra esse domínio realizando um evento anual - e mortal - entre os 12 distritos sob sua tutela. Para salvar sua irmã caçula, a jovem Katniss Everdeen (Jennifer Lawrence) se oferece como voluntária para representar seu distrito na competição e acaba contando com a companhia de Peeta Melark (Josh Hutcherson), desafiando não só o sistema dominante, mas também a força dos outros oponentes.',
                        '02:22:00',
                        '2012-03-23',
                        null,
                        'https://www.distrito13.com.br/wp-content/uploads/2011/09/normal_328985_227053757341875_189244931122758_626710_5646920_o-1.jpg',
                        '29.00'
                        );
                        
insert into tbl_filme (nome,
						sinopse,
                        duracao,
                        data_lancamento,
                        data_relancamento,
                        foto_capa,
                        valor_unitario
						) values (
                        'Os Vingadores',
                        'Loki (Tom Hiddleston) retorna à Terra enviado pelos chitauri, uma raça alienígena que pretende dominar os humanos. Com a promessa de que será o soberano do planeta, ele rouba o cubo cósmico dentro de instalações da S.H.I.E.L.D. e, com isso, adquire grandes poderes. Loki os usa para controlar o dr. Erik Selvig (Stellan Skarsgard) e Clint Barton/Gavião Arqueiro (Jeremy Renner), que passam a trabalhar para ele. No intuito de contê-los, Nick Fury (Samuel L. Jackson) convoca um grupo de pessoas com grandes habilidades, mas que jamais haviam trabalhado juntas: Tony Stark/Homem de Ferro (Robert Downey Jr.), Steve Rogers/Capitão América (Chris Evans), Thor (Chris Hemsworth), Bruce Banner/Hulk (Mark Ruffalo) e Natasha Romanoff/Viúva Negra (Scarlett Johansson). Só que, apesar do grande perigo que a Terra corre, não é tão simples assim conter o ego e os interesses de cada um deles para que possam agir em grupo.',
                        '02:23:00',
                        '2012-04-27',
                        null,
                        'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/89/43/82/20052140.jpg',
                        '39.00'
                        );


select * from tbl_filme