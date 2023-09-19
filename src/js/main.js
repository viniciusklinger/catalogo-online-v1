$(document).ready(function () {
    cardapio.eventos.init();
    $("#data-cep").on("input", debounce(cardapio.metodos.buscarCep, 150));
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 0;

var CELULAR_EMPRESA = '5542998663675';

var map;

var LOCAL_LOJA = { lat: -25.09797509988559, lng: -50.16480066847686 };

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoReserva();
    }

}

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func(this, args); }, timeout);
    };
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
        cardapio.metodos.toast('Adicionado ao carrinho!', 'green')
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

    trocarEtapa: (etapa) => {
        $('#modal-carrinho').attr('data-etapa', etapa);
        $('#etapa-label').text(`${etapa === 1 ? 'Seu pedido' : etapa === 2 ? 'Endereço de entrega' : 'Resumo do pedido'}:`);
    },

    carregarCarrinho: () => {


        /* MEU_CARRINHO = load cache */
        /* let etapa = meuCarrinho.etapa ?? 1; */
        let etapa = 1;
        cardapio.metodos.trocarEtapa(etapa);

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
        let qtd = parseInt($("#qtd-sacola-" + id).text());
        qtd = qtd > 1 ? qtd - 1 : 0;
        $("#qtd-sacola-" + id).text(qtd);
        cardapio.metodos.atualizarCarrinho(id, qtd);

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

    navegarEtapa: (direcao) => {

        let oldEtapa = parseInt($('#modal-carrinho').attr('data-etapa')) + (direcao == 'true' ? 1 : - 1);
        let newEtapa = oldEtapa > 0 ? oldEtapa : 1;

        if (newEtapa == 2) {
            if (MEU_CARRINHO.length == 0) {
                cardapio.metodos.toast('Sua sacola está vazia.')
                return;
            };
            if (!map) cardapio.metodos.carregarMapa();
        } else if (newEtapa == 3) {
            if (!cardapio.metodos.validarEndereco()) return;
            cardapio.metodos.carregarResumo();
        } else if (newEtapa == 4) {
            cardapio.metodos.finalizarPedido();
            return;
        };

        if (newEtapa != 1) {
            $('#cart-nav-voltar').attr('data-show', 'true');
        } else {
            $('#cart-nav-voltar').removeAttr('data-show');
        };

        newEtapa = newEtapa <= 3 ? newEtapa : 3;
        $('#modal-carrinho').attr('data-etapa', newEtapa);
        $('#cart-nav-avancar').text(newEtapa === 1 ? 'Continuar' : newEtapa === 2 ? 'Revisar pedido' : 'Fazer pedido');
        cardapio.metodos.trocarEtapa(newEtapa);

    },

    buscarCep: async () => {

        let cep = $("#data-cep").val().trim().replace(/\D/g, '');
        if (cep != "") {

            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                try {
                    $("#delivery-view").attr('data-loading', 'true');
                    await $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                        if (!("erro" in dados)) {
                            $("#data-rua").val(dados.logradouro);
                            $("#data-bairro").val(dados.bairro);
                            $("#data-cidade").val(dados.localidade);
                            $("#data-uf").val(dados.uf);
                            $("#data-numero").focus();
                        }
                        else {
                            cardapio.metodos.toast('CEP não encontrado. Preencha as informações manualmente ou tente novamente.');
                            $("#txtEndereco").focus();
                        }
                    });

                } finally {
                    $("#delivery-view").removeAttr('data-loading');
                };
            };
        };

    },

    validarEndereco: () => {

        let cep = $("#data-cep").val().trim();
        let endereco = $("#data-rua").val().trim();
        let bairro = $("#data-bairro").val().trim();
        let cidade = $("#data-cidade").val().trim();
        let uf = $("#data-uf").val().trim();
        let numero = $("#data-numero").val().trim();
        let complemento = $("#data-complemento").val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.toast('Informe o CEP, por favor.');
            $("#data-cep").focus();
            return false;
        }
        if (endereco.length <= 0) {
            cardapio.metodos.toast('Informe a Rua, por favor.');
            $("#data-rua").focus();
            return false;
        }
        if (bairro.length <= 0) {
            cardapio.metodos.toast('Informe o Bairro, por favor.');
            $("#data-bairro").focus();
            return false;
        }
        /* if (cidade.length <= 0) {
            cardapio.metodos.toast('Informe a Cidade, por favor.');
            $("#data-cidade").focus();
            return false;
        }
        if (uf == "-1") {
            cardapio.metodos.toast('Informe a UF, por favor.');
            $("#data-uf").focus();
            return false;
        } */
        if (numero.length <= 0) {
            cardapio.metodos.toast('Informe o Número, por favor.');
            $("#data-numero").focus();
            return false;
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

        return true

    },

    carregarResumo: () => {

        $("#resumo-items-pedido").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, (e.price * e.qtd).toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qtd)
                .replace(/\${border}/g, i+1 == MEU_CARRINHO.length ? '' : 'border-b')

            $("#resumo-items-pedido").append(temp);

        });

        $("#resumo-endereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#resumo-endereco-2").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} - ${MEU_ENDERECO.complemento}`);

    },

    finalizarPedido: () => {
        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {


            let texto = 'Olá! gostaria de fazer um pedido:';
            texto += `\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\nEntrega: R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`;
            texto += `\n*Total: R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            let itens = '';
            $.each(MEU_CARRINHO, (i, e) => {
                
                itens += `*${e.qtd}x* ${e.name} ....... R$ ${(e.price * e.qtd).toFixed(2).replace('.', ',')}\n`;

                if ((i + 1) == MEU_CARRINHO.length) {
                    texto = texto.replace(/\${itens}/g, itens);
                    let encoded = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encoded}`;
                    window.open(URL, '_blank');
                };

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

    toast: (texto, cor = 'red', tempo = 2500) => {

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
    },

    carregarMapa: async () => {
        const position = LOCAL_LOJA;
        const { Map } = await google.maps.importLibrary("maps");
        const { Marker } = await google.maps.importLibrary("marker")
      
        map = new Map(document.getElementById("delivery-map"), {
          zoom: 13,
          center: position,
        });

        const marker = new Marker({
            position: position,
            map,
        });

        google.maps.event.addListener(map, 'click', function (event) {
            marker.setPosition(event.latLng);
            console.log(event.latLng.toJSON());
            window.setTimeout(() => {
              map.panTo(event.latLng);
            }, 400);
        });
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
                <div class="h-12 w-12 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-xl shrink-0 flex">
                    <img src="\${img}" alt="" class="rounded-xl">
                </div>
                <div class="px-2 flex flex-col justify-center font-bold">
                    <p class="text-sm sm:text-lg lg:text-xl">\${nome}</p>
                    <p class="text-primary text-lg lg:text-2xl">R$ \${preco}</p>
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
        <div class="flex flex-row justify-between items-center \${border} border-gray-300 py-2">
            <div class="flex">
                <div class="shrink-0 p-1">
                    <img class="h-12 w-12 rounded-xl" src="\${img}" />
                </div>
                <div class="flex flex-col ml-2 justify-center">
                    <p class="text-default text-sm md:text-base">
                        <b>\${nome}</b>
                    </p>
                    <p class="text-primary md:text-lg">
                        <b>R$ \${preco}</b>
                    </p>
                </div>
            </div>
            <p class="mr-2 font-bold">
                x \${qntd}
            </p>
        </div>
    `
}