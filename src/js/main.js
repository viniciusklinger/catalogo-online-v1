$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 7.5;

var CELULAR_EMPRESA = '5542998663675';

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoReserva();
    }

}

cardapio.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];
        let step =  $(document).width() < 1279 ? 6 : 8;
        let count = 0;

        if (!vermais) {
            $("#itens-cardapio").html('');
            $("#btn-ver-mais").removeClass('hidden');
        } else {
            count = $("#itens-cardapio").children().length;
        }

        $.each(filtro, (i, e) => {

            let ings = e.ings && e.ings.length > 0 ? e.ings.map( (item) => `<li>${item}</li>`).join(' ') : '';
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)
            .replace(/\${ing-item}/g, ings)

            // botão ver mais foi clicado (+4 itens)
            if (vermais && i >= count && i < count + step) {
                $("#itens-cardapio").append(temp)
            }

            // paginação inicial (mostra 8 itens)
            if (!vermais && i < (step === 6 ? 6 : 8)) {
                $("#itens-cardapio").append(temp)
            }

        })

        // seta estados
        if ($("#itens-cardapio").children().length == filtro.length) {
            $("#btn-ver-mais").addClass('hidden');
        }
        $(".cardapio-menu button").attr('data-active', 'false');
        $("#cardapio-btn-" + categoria).attr('data-active', 'true');

    },

    // clique no botão de ver mais
    verMais: () => {

        var categoria = $(".cardapio-menu").find("[data-active=true]").attr('id').split('cardapio-btn-')[1];
        cardapio.metodos.obterItensCardapio(categoria, true);

    },

  /*   // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    }, */

    adicionarAoCarrinho: (id) => {

        let cat = $("#menu-cardapio").find(`[data-active=true]`).attr('id').split('cardapio-btn-')[1];
        let item = MENU[cat].filter(el => el.id == id)[0] ?? null;
        let existe = MEU_CARRINHO.filter( el => el.id == id);

        if (!item) {
            console.error('Erro ao adicionar item à sacola. Item não encontrado');
            return;
        };

        if (existe.length == 0) {
            let temp = {};
            temp.id = item.id;
            temp.name = item.name;
            temp.img = item.img;
            temp.price = item.price;
            temp.qtd = 1;
            MEU_CARRINHO.push(temp);
        } else {
            existe[0].qtd += 1;
        }

        if (MEU_CARRINHO.length > 0) {
            $('#btn-carrinho').removeClass('hidden');
        } else {
            $('#btn-carrinho').addClass('hidden');
        };
        cardapio.metodos.mensagem('Adicionado ao carrinho!', 'green')
        cardapio.metodos.atualizarContagemCarrinho();

    },

    atualizarContagemCarrinho: () => {

        var total = 0;
        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qtd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        };
        $("#cart-count").html(total.toString());

    },

    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modal-carrinho").removeClass('hidden');
            /* block scrolling on body */
            $("#body-data").attr('data-modal', 'open');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modal-carrinho").addClass('hidden');
            $("#body-data").removeAttr('data-modal');
        }

    },

    carregarEtapa: (etapa) => {

        $('#modal-carrinho').attr('data-etapa', etapa);
        $('#etapa-label').text(`${etapa === 1 ? 'Seu pedido' : etapa === 2 ? 'Endereço de entrega' : 'Resumo do pedido'}:`);

        if (etapa == 10) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }
        
        if (etapa == 20) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if (etapa == 30) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

    },

    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },


    carregarCarrinho: () => {


        /* MEU_CARRINHO = load cache */
        /* let etapa = meuCarrinho.etapa ?? 1; */
        let etapa = 1;
        cardapio.metodos.carregarEtapa(etapa);

        if (MEU_CARRINHO.length > 0) {

            $("#items-pedido").html('');
            $('#default-view').addClass('hidden');

            $.each(MEU_CARRINHO, (i, e) => {
                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qtd)
                .replace(/\${border}/g, i+1 == MEU_CARRINHO.length ? '' : 'border-b')

                $("#items-pedido").append(temp);

            })

            cardapio.metodos.carregarValores();
        }
        else {
            $("#items-pedido").html('');
            $('#default-view').removeClass('hidden');
            $('#btn-carrinho').addClass('hidden');
            
            cardapio.metodos.carregarValores();
        }

    },


    diminuirQuantidadeCarrinho: (id) => {

        let qtdAtual = parseInt($("#qtd-sacola-" + id).text());

        if (qtdAtual > 1) {
            $("#qtd-sacola-" + id).text(qtdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qtdAtual - 1);
        }
        else {
            $("#qtd-sacola-" + id).text(0);
        }

    },

    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qtd-sacola-" + id).text());
        $("#qtd-sacola-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

    },

    removerItemCarrinho: (id) => {

        let newValues = MEU_CARRINHO.filter(el => el.id != id);
        if (MEU_CARRINHO.length == newValues.length) {
            console.error('ID não encontrado no carrinho.');
            return;
        }
        MEU_CARRINHO = newValues
        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarContagemCarrinho();
        
    },

    atualizarCarrinho: (id, qntd) => {

        let item = MEU_CARRINHO.filter(el => el.id == id)[0];
        if (!item) {
            console.error('ID não encontrado no carrinho.');
            return;
        }
        item.qtd = qntd

        cardapio.metodos.atualizarContagemCarrinho();
        cardapio.metodos.carregarValores();

    },

    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qtd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#cart-subtotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                /* $("#cart-entrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`); */
                $("#cart-total").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }

        })

    },

    // carregar a etapa enderecos
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio.')
            return;
        } 

        cardapio.metodos.carregarEtapa(2);

    },

    // API ViaCEP
    buscarCep: () => {

        // cria a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        // verifica se o CEP possui valor informado
        if (cep != "") {

            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        // Atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();

                    }
                    else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }

                })

            }
            else {
                cardapio.metodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
        }

    },

    // validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }

        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a Cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Número, por favor.');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    // carrega a etapa de Resumo do pedido
    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);

        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();

    },

    // Atualiza o link do botão do WhatsApp
    finalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

            var texto = 'Olá! gostaria de fazer um pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                // último item
                if ((i + 1) == MEU_CARRINHO.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                    // converte a URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);

                }

            })

        }

    },

    // carrega o link do botão reserva
    carregarBotaoReserva: () => {

        var texto = 'Olá! gostaria de fazer uma *reserva*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    // carrega o botão de ligar
    carregarBotaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },

    // abre o depoimento
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    // mensagens
    mensagem: (texto, cor = 'red', tempo = 2500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div data-color="${cor}" id="msg-${id}" class="data-[color=red]:bg-red-400 data-[color=green]:bg-green-400 text-white p-2 sm:px-4 sm:py-3 mt-1 sm:mt-2 rounded-lg shadow-xl">${texto}</div>`;

        $("#toast-container").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    },

    handleCardExpansion: (el) => {

        let viewport =  $(document).width();

        $("#itens-cardapio").children().each((ind, card) => {
            $(card).removeAttr('data-expand');
        })

        if (viewport < 640) {
            $(el).attr('data-expand', 'true');
        };
    }
}

cardapio.templates = {

    item: `
        <div id="\${id}" class="bg-white w-10/12 max-w-sm sm:w-[255px] p-2 shadow-md rounded-2xl max-h-[110px] sm:max-h-[360px] xs:max-h-32 sm:h-[360px] group data-[expand=true]:max-h-[290px] xs:data-[expand=true]:max-h-96 sm:hover:h-[360px] flex flex-row sm:block transition-all mb-3 overflow-hidden mx-auto" onclick="cardapio.metodos.handleCardExpansion(this)">
            <div class="h-20 w-20 xs:h-24 xs:w-24 sm:h-56 sm:w-56 bg-gray-200 rounded-xl m-2 shrink-0 group-data-[expand=true]:hidden sm:group-hover:hidden">
                <img src="\${img}" alt="" class="rounded-xl">
            </div>
            <div class="self-start p-2 flex flex-col w-full group-data-[expand=true]:xs:text-center group-data-[expand=true]:items-center sm:group-hover:text-center sm:group-hover:items-center">
                <h3 class="font-semibold text-xl line-clamp-1 sm:text-center group-data-[expand=true]:text-center sm:group-hover:text-center" title="\${nome}">\${nome}</h3>
                <ul class="hidden text-left overflow-y-auto text-[#7d7d7d] text-sm font-semibold list-disc list-inside m-3 group-data-[expand=true]:block sm:group-hover:block min-w-[220px] xs:min-w-[250px] sm:min-w-full max-w-[250px] xs:max-w-[280px] max-h-[140px] xs:max-h-[234px] sm:h-[208px]">
                    \${ing-item}
                </ul>
                <p class="font-bold text-lg xs:text-xl sm:text-2xl text-primary group-data-[expand=true]:text-center sm:group-hover:text-center sm:text-center">R$ \${preco}</p>
                <button class="border-2 border-default rounded-2xl p-2 py-1 w-fit hidden group-data-[expand=true]:block sm:group-hover:block lg:hover:bg-primary lg:hover:text-white lg:hover:border-primary active:bg-primary active:text-white active:border-primary" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')">Adicionar ao pedido</button>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="flex flex-row justify-between p-2 \${border} border-gray-300 w-full items-center">
            <div class="flex">
                <div class="h-12 w-12 sm:h-24 sm:w-24 bg-gray-200 rounded-xl p-1 sm:p-2 shrink-0 flex">
                    <img src="\${img}" alt="" class="rounded-xl">
                </div>
                <div class="px-2 flex flex-col justify-center font-bold">
                    <p class="text-sm">\${nome}</p>
                    <p class="text-primary text-lg">R$ \${preco}</p>
                </div>
            </div>
            <div id="item-sacola-\${id}" class="flex group shrink-0">
                <div class="flex flex-row border-2 border-default rounded-xl h-9 text-center font-medium text-sm sm:text-xl">
                    <button class="px-2" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')">-</button>
                    <div class="border-l-2 border-r-2 border-default w-7 sm:w-12 flex items-center justify-center">
                        <span id="qtd-sacola-\${id}" class="pointer-events-none select-none">\${qntd}</span>
                    </div>
                    <button id="item-btn-inc"class="px-2" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')">+</button>
                </div>
                <button class="ml-1 sm:ml-2" onclick="cardapio.metodos.removerItemCarrinho('\${id}')">
                    <img class="h-6 w-6" src="./imgs/icon/trash.png" />
                </button>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${preco}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `
}