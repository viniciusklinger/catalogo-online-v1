$(document).ready(function () {
    Cardapio.init();
})

var cardapio = {};
var toast = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = {valor: 0, maxValue: false};
var TAXA_ENTREGA = {
    6: 1.8,
    10: 1.7,
    15: 1.4,
    999: 1.3,
};

var CELULAR_LOJA = '5542998663675';
var ENDERECO_LOJA = 'Rua Siqueira Campos, 1806 - Uvaranas, Ponta Grossa - PR, 84031-030'
var LINK_MAPS_LOJA = 'https://maps.app.goo.gl/mPvKa5kHPQwQCMGJ6'
var LOCAL_LOJA = { lat: -25.109664656607833, lng: -50.12425511392971 };

var map;

const MapsServices = (function () {
    let renderedMap;
    let marker;
    let directionsService;
    let infoWindow;

    async function init() {
        if (renderedMap) return;

        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { Marker } = await google.maps.importLibrary("marker");
        const { DirectionsService } = await google.maps.importLibrary("routes");

        renderedMap = new Map(document.getElementById("delivery-map"), {
            zoom: 13,
            center: LOCAL_LOJA,
            styles: [
              {
                "featureType": "poi.business",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              
            ]
        });
        marker = new Marker({
            position: LOCAL_LOJA,
            animation: google.maps.Animation.DROP,
            renderedMap,
            draggable: true,
        });
        directionsService = new DirectionsService();
        infoWindow = new InfoWindow();
        attachEvents();
    };

    function attachEvents() {
        google.maps.event.addListener(renderedMap, 'click', function (event) {
            marker.setPosition(event.latLng);
            window.setTimeout(() => {
              renderedMap.panTo(event.latLng);
            }, 400);
            cardapio.metodos.updateDirections(marker.getPosition());
        });
        const locationButton = document.querySelector('#btn-use-location-service');
        locationButton.addEventListener("click", () => {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };

                  marker.setPosition(pos);
                  infoWindow.setContent("Clique no mapa ou arraste o PIN para corrigir.");
                  infoWindow.open(renderedMap, marker);
                  renderedMap.panTo(pos);
                  window.setTimeout(() => {
                    renderedMap.setCenter(pos),
                    renderedMap.setZoom(17);
                  }, 400);
                  updateDirections(marker.getPosition());
                },
                () => {
                  handleLocationError(true, infoWindow, marker.getPosition());
                },
              );
            } else {
              // Browser doesn't support Geolocation
              handleLocationError(false, infoWindow, marker.getPosition());
            }
        });
    };

    function updateDirections(dest) {
        if(!renderedMap) init();

        const newRoute = {
            origin: LOCAL_LOJA,
            destination: dest,
            travelMode: 'DRIVING',
            language: '	pt-BR',
        }
        directionsService.route(newRoute, function(res, status) {
            if (status != 'OK') {
                let msg = status == 'OVER_QUERY_LIMIT' ? 'Este recurso foi temporariamente bloqueado. Preencha os campos manualmente ou aguarde alguns minutos para usar novamente.' : status;
                Toast.create(msg, 'red', 7500);
                console.error('Directions request failed due to ' + status);
                return;
            }
            let directionsData = res.routes[0].legs[0];
            if (!directionsData) {
                console.error('Directions request failed.');
                return;
            } 
            /* Cardapio.metodos.calcularValorEntrega(directionsData);
            Cardapio.metodos.AtualizarValoresTotais();
            Cardapio.metodos.atualizarEndereco(directionsData.end_address); */
        });
    };

    return {
        init,
        updateDirections
    };
})();

const Cardapio = (function () {

    function init() {
        metodos.obterItensCardapio();
        metodos.carregarBotaoLigar();
        metodos.carregarBotaoReserva();

        document.querySelector('#endereco-label').setAttribute('data-endereco', ENDERECO_LOJA);
        document.querySelector('#data-cep').addEventListener('input', (helpers.debounce(Cardapio.metodos.buscarCep, 150)));
    };

    function attachEvents() {
        $("#data-cep").on("input", helpers.debounce(Cardapio.metodos.buscarCep, 150));
        /* $("#data-numero").on("input", helpers.debounce(Cardapio.metodos.calcularEntrega, 600)); */
    };

    const metodos = {
        obterItensCardapio: (categoria = 'burgers', vermais = false) => {

            var filtro = MENU[categoria];
            let step =  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) < 1279 ? 6 : 8;
            let count = 0;

            if (!vermais) {
                document.querySelector('#itens-cardapio').innerHTML = '';
                document.querySelector('#btn-ver-mais').classList.remove('hidden');
            } else {
                count = document.querySelector('#itens-cardapio').children.length;
            };
            
            filtro.forEach((e, i) => {
                let ings = e.ings && e.ings.length > 0 ? e.ings.map( (item) => `<li>${item}</li>`).join(' ') : '';
                let temp = templates.item.replace(/\${img}/g, e.img)
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
            if (document.querySelector('#itens-cardapio').children.length == filtro.length) {
                document.querySelector('#btn-ver-mais').classList.add('hidden');
            };

            let botoes = document.querySelectorAll('.cardapio-menu > button');
            helpers.processNodeList(botoes, 'setAttr', 'data-active', 'false');
            document.querySelector('#cardapio-btn-' + categoria).setAttribute("data-active", 'true');

        },

        verMais: () => {
            let cat = document.querySelector('.cardapio-menu > [data-active="true"]').getAttribute("id").split('cardapio-btn-')[1];
            Cardapio.metodos.obterItensCardapio(cat, true);
        },

        adicionarAoCarrinho: (id) => {
            
            let cat = document.querySelector('#menu-cardapio > [data-active="true"]').getAttribute("id").split('cardapio-btn-')[1];
            let existe = MEU_CARRINHO.filter( el => el.id == id);
            
            let item = MENU[cat].filter(el => el.id == id)[0] ?? null;
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

            Toast.create('Adicionado ao carrinho!', 'green');
            document.querySelector('#btn-carrinho').classList.remove('hidden');
            Cardapio.metodos.atualizarContadorCarrinho();

        },

        atualizarContadorCarrinho: () => {
            const total = MEU_CARRINHO.length > 0 ? MEU_CARRINHO.reduce((acc, e) => {return acc + e.qtd}, 0) : 0;
            document.querySelector('#cart-counter').textContent = total;
        },

        abrirCarrinho: (abrir) => {

            if (abrir) {
                metodos.renderizarCarrinho();
                document.querySelector('#modal-carrinho').classList.remove('hidden');
                /* block scrolling on body */
                document.querySelector('#body-data').setAttribute('data-modal', 'open');
                MapsServices.init();
            }
            else {
                document.querySelector('#modal-carrinho').classList.add('hidden');
                document.querySelector('#body-data').removeAttribute('data-modal');
            }

        },

        renderizarCarrinho: () => {
            let etapa = 1;
            Cardapio.metodos.trocarEtapa(etapa);

            document.querySelector('#items-pedido').innerHTML = '';
            if (MEU_CARRINHO.length > 0) {
                document.querySelector('#default-view').classList.add('hidden');
                MEU_CARRINHO.forEach((item, i) => {
                    let temp = templates.itemCarrinho.replace(/\${img}/g, item.img)
                    .replace(/\${nome}/g, item.name)
                    .replace(/\${preco}/g, item.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, item.id)
                    .replace(/\${qntd}/g, item.qtd)
                    .replace(/\${border}/g, i+1 == MEU_CARRINHO.length ? '' : 'border-b')

                    document.querySelector('#items-pedido').insertAdjacentHTML('beforeend', temp);
                });
            } else {
                document.querySelector('#default-view').classList.remove('hidden');
                document.querySelector('#btn-carrinho').classList.add('hidden');
            }
            Cardapio.metodos.AtualizarValoresTotais();
        },

        alterarQuantidadeCarrinho: (id, somar) => {
            if (!id) {
                console.error('id is empty');
                return;
            }

            const selectedItemElement = document.querySelector('#qtd-sacola-' + id);
            const currentValue = parseFloat(selectedItemElement.textContent);
            const newValue = Math.max(somar ? currentValue + 1 : currentValue - 1, 0)

            const selectedItem = MEU_CARRINHO.filter(el => el.id == id)[0];
            if (!selectedItem) {
                console.error('ID não encontrado no carrinho.');
                return;
            }
            selectedItem.qtd = newValue
            selectedItemElement.textContent = newValue

            metodos.AtualizarValoresTotais();
            metodos.atualizarContadorCarrinho();
        },

        removerItemCarrinho: (id) => {
            let updatedCart = MEU_CARRINHO.filter(el => el.id != id);
            if (MEU_CARRINHO.length == updatedCart.length) {
                console.error('ID não encontrado no carrinho.');
                return;
            }
            MEU_CARRINHO = updatedCart
            document.querySelector(`#container-sacola-${id}`).remove();
            Cardapio.metodos.AtualizarValoresTotais();
            Cardapio.metodos.atualizarContadorCarrinho();
            if (updatedCart.length == 0) {
                document.querySelector('#default-view').classList.remove('hidden');
                document.querySelector('#btn-carrinho').classList.add('hidden');
            };
            
        },

        AtualizarValoresTotais: () => {

            VALOR_CARRINHO = MEU_CARRINHO.length > 0 ? MEU_CARRINHO.reduce((acc, e) => {return acc + (e.qtd * e.price)}, 0) : 0;
            document.querySelector('#cart-subtotal').textContent = `R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`;
            document.querySelector('#cart-entrega').textContent = `+ R$ ${VALOR_ENTREGA.valor.toFixed(2).replace('.', ',')}`;
            document.querySelector('#cart-total').textContent = `R$ ${(VALOR_CARRINHO + VALOR_ENTREGA.valor).toFixed(2).replace('.', ',')}`;

            if (VALOR_ENTREGA.maxValue) {
                document.querySelector('#entrega-label').setAttribute('data-max', 'true');
            } else {
                document.querySelector('#entrega-label').removeAttribute('data-max'); 
            }
        },

        navegarEtapa: (direcao) => {
            let current = parseInt(document.querySelector('#modal-carrinho').getAttribute('data-etapa'))
            let newEtapa = Math.max(current + (direcao == 'true' ? 1 : -1), 1);

            if (newEtapa == 2) {
                if (MEU_CARRINHO.length == 0) {
                    Toast.create('Sua sacola está vazia.')
                    return;
                };
            } else if (newEtapa == 3) {
                if (!Cardapio.metodos.validarEndereco()) return;
                Cardapio.metodos.carregarResumo();
            } else if (newEtapa == 4) {
                Cardapio.metodos.finalizarPedido();
                return;
            };

            if (newEtapa != 1) {
                document.querySelector('#cart-nav-voltar').setAttribute('data-show', 'true');
            } else {
                document.querySelector('#cart-nav-voltar').removeAttribute('data-show');
            };

            newEtapa = Math.min(newEtapa, 3);
            document.querySelector('#cart-nav-avancar').textContent = (newEtapa === 1 ? 'Continuar' : newEtapa === 2 ? 'Revisar pedido' : 'Fazer pedido');
            Cardapio.metodos.trocarEtapa(newEtapa);
        },

        trocarEtapa: (etapa) => {
            document.querySelector('#modal-carrinho').setAttribute('data-etapa', etapa);
            document.querySelector('#etapa-label').textContent = (`${etapa === 1 ? 'Seu pedido' : etapa === 2 ? 'Endereço de entrega' : 'Resumo do pedido'}:`);
        },

        buscarCep: async () => {
            let cep = document.querySelector('#data-cep').value.trim().replace(/\D/g, '');
            if (cep != "") {
                let validacep = /^[0-9]{8}$/;
                if (validacep.test(cep)) {
                    try {
                        document.querySelector('#delivery-view').setAttribute('data-loading', 'true');

                        await $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                            if (!("erro" in dados)) {
                                document.querySelector('#data-rua').value = dados.logradouro;
                                document.querySelector('#data-bairro').value = dados.bairro;
                                document.querySelector('#data-cidade').value = dados.localidade;
                                document.querySelector('#data-uf').value = dados.uf;
                                /* document.querySelector('#data-numero").focus(); */
                            }
                            else {
                                Toast.create('CEP não encontrado. Preencha as informações manualmente ou tente novamente.', 'red', 5000);
                                /* document.querySelector('#data-rua").focus(); */
                            }
                        });

                    } finally {
                        document.querySelector('#delivery-view').removeAttribute('data-loading');
                    };
                };
            };

        },

        validarEndereco: () => {
            let cep = document.querySelector('#data-cep').value.trim();
            let endereco = document.querySelector('#data-rua').value.trim();
            let bairro = document.querySelector('#data-bairro').value.trim();
            let cidade = document.querySelector('#data-cidade').value.trim();
            let uf = document.querySelector('#data-uf').value.trim();
            let numero = document.querySelector('#data-numero').value.trim();
            let complemento = document.querySelector('#data-complemento').value.trim();

            if (cep.length <= 0) {
                Toast.create('Informe o CEP, por favor.');
                document.querySelector('#data-cep').focus();
                return false;
            }
            if (endereco.length <= 0) {
                Toast.create('Informe a Rua, por favor.');
                document.querySelector('#data-rua').focus();
                return false;
            }
            if (bairro.length <= 0) {
                Toast.create('Informe o Bairro, por favor.');
                document.querySelector('#data-bairro').focus();
                return false;
            }
            /* if (cidade.length <= 0) {
                Toast.create('Informe a Cidade, por favor.');
                document.querySelector('#data-cidade').focus();
                return false;
            }
            if (uf == "-1") {
                Toast.create('Informe a UF, por favor.');
                document.querySelector('#data-uf').focus();
                return false;
            } */

            if (numero.length <= 0) {
                Toast.create('Informe o Número, por favor.');
                document.querySelector('#data-numero').focus();
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
            document.querySelector('#resumo-items-pedido').innerHTML = '';

            MEU_CARRINHO.forEach((e, i) => {
                let temp = templates.itemResumo.replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${preco}/g, (e.price * e.qtd).toFixed(2).replace('.', ','))
                    .replace(/\${qntd}/g, e.qtd)
                    .replace(/\${border}/g, i+1 == MEU_CARRINHO.length ? '' : 'border-b')
                document.querySelector('#resumo-items-pedido').insertAdjacentHTML('beforeend', temp);
            })

            document.querySelector('#resumo-endereco').innerHTML = (`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
            document.querySelector('#resumo-endereco-2').innerHTML = (`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} - ${MEU_ENDERECO.complemento}`);
        },

        finalizarPedido: () => {
            if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {


                let texto = 'Olá! gostaria de fazer um pedido:';
                texto += `\n\n\${itens}`;
                texto += '\n*Endereço de entrega:*';
                texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
                texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
                texto += `\n\nEntrega: R$ ${VALOR_ENTREGA.valor.toFixed(2).replace('.', ',')}`;
                texto += `\n*Total: R$ ${(VALOR_CARRINHO + VALOR_ENTREGA.valor).toFixed(2).replace('.', ',')}*`;

                let itens = '';
                $.each(MEU_CARRINHO, (i, e) => {
                    
                    itens += `*${e.qtd}x* ${e.name} ....... R$ ${(e.price * e.qtd).toFixed(2).replace('.', ',')}\n`;

                    if ((i + 1) == MEU_CARRINHO.length) {
                        texto = texto.replace(/\${itens}/g, itens);
                        let encoded = encodeURI(texto);
                        let URL = `https://wa.me/${CELULAR_LOJA}?text=${encoded}`;
                        window.open(URL, '_blank');
                    };

                })

            }

        },

        // carrega o link do botão reserva
        carregarBotaoReserva: () => {

            var texto = 'Olá! gostaria de fazer uma *reserva*';

            let encode = encodeURI(texto);
            let URL = `https://wa.me/${CELULAR_LOJA}?text=${encode}`;

            $("#btnReserva").attr('href', URL);

        },

        // carrega o botão de ligar
        carregarBotaoLigar: () => {

            $("#btnLigar").attr('href', `tel:${CELULAR_LOJA}`);

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

        handleCardExpansion: (el) => {

            let viewport =  window.innerWidth;
            let renderedCards = document.querySelector('#itens-cardapio').children;
            helpers.processNodeList(renderedCards, 'rmAttr', 'data-expand');

            if (viewport < 640) {
                el.setAttribute('data-expand', 'true');
            };
        },

        handleDeliveryMode: (mode) => {
            document.querySelector('#modal-carrinho').setAttribute('data-modo', mode);
            if (mode == 2) {
                Cardapio.metodos.updateDirections(LOCAL_LOJA);
            }
        },

        atualizarEndereco(endereco) {
            const ruaMatch = endereco.match(/([\w\s.-]+),/) ?? null;
            const numeroMatch = endereco.match(/(\d+) -/) ?? null;
            const bairroMatch = endereco.match(/- ([\w\s.-]+),/) ?? null;
            const cidadeMatch = endereco.match(/([^,]+),\s+(\d+)\s+-\s+([^,]+)/) ?? null;
            const ufMatch = endereco.match(/- ([A-Z]{2}),/) ?? null;
            const cepMatch = endereco.match(/(\d{5}-\d{3})/) ?? null;

            /* console.log(`
                endereco: ${endereco}\n
                ruaMatch: ${ruaMatch[1].trim()}\n
                numeroMatch: ${numeroMatch[1].trim()}\n
                bairroMatch: ${bairroMatch[1].trim()}\n
                cidadeMatch: ${cidadeMatch[3].trim()}\n
                ufMatch: ${ufMatch[1].trim()}\n
                cepMatch: ${cepMatch[1].trim()}\n
            `); */

            document.querySelector('#data-cep').value = cepMatch[1].trim();/* 
            $("#data-rua").val(ruaMatch[1].trim());
            $("#data-bairro").val(bairroMatch[1].trim());
            $("#data-cidade").val(cidadeMatch[3].trim());
            $("data-uf").val(ufMatch[1].trim());
            $("#data-numero").val(numeroMatch[1].trim()); */

            Cardapio.metodos.buscarCep();
            return;
        },

        calcularValorEntrega(data) {
            let distance = data.distance.value / 1000;
            let duration = data.duration.value;
            let taxa = 0

            for (const [dist, valor] of Object.entries(TAXA_ENTREGA)) {
                /* console.log('dist: ', dist, '\nvalor: ', valor);
                console.log('res: ', distance < dist); */
                if (distance < dist) {
                    taxa = valor;
                    break;
                }
            }
            /* console.log(" Driving distance is " + directionsData.distance.text + " (" + directionsData.duration.text + ").") */
            VALOR_ENTREGA.valor = (distance * 2) * taxa;
            VALOR_ENTREGA.maxValue = (distance * 2) * taxa > 25 ? true : false;
        },
    };

    const templates = {
        item: `
            <div id="\${id}" class="bg-white w-10/12 max-w-sm sm:w-[255px] p-2 shadow-md rounded-2xl max-h-[110px] sm:max-h-[360px] xs:max-h-32 sm:h-[360px] group data-[expand=true]:max-h-[290px] xs:data-[expand=true]:max-h-96 sm:hover:h-[360px] flex flex-row sm:block transition-all mb-3 overflow-hidden mx-auto" onclick="Cardapio.metodos.handleCardExpansion(this)">
                <div class="h-20 w-20 xs:h-24 xs:w-24 sm:h-56 sm:w-56 bg-gray-200 rounded-xl m-2 shrink-0 group-data-[expand=true]:hidden sm:group-hover:hidden">
                    <img src="\${img}" alt="" class="rounded-xl">
                </div>
                <div class="self-start p-2 flex flex-col w-full group-data-[expand=true]:xs:text-center group-data-[expand=true]:items-center sm:group-hover:text-center sm:group-hover:items-center">
                    <h3 class="font-semibold text-xl line-clamp-1 sm:text-center group-data-[expand=true]:text-center sm:group-hover:text-center" title="\${nome}">\${nome}</h3>
                    <ul class="hidden text-left overflow-y-auto text-[#7d7d7d] text-sm font-semibold list-disc list-inside m-3 group-data-[expand=true]:block sm:group-hover:block min-w-[220px] xs:min-w-[250px] sm:min-w-full max-w-[250px] xs:max-w-[280px] max-h-[140px] xs:max-h-[234px] sm:h-[208px]">
                        \${ing-item}
                    </ul>
                    <p class="font-bold text-lg xs:text-xl sm:text-2xl text-primary group-data-[expand=true]:text-center sm:group-hover:text-center sm:text-center">R$ \${preco}</p>
                    <button class="border-2 border-default rounded-2xl p-2 py-1 w-fit hidden group-data-[expand=true]:block sm:group-hover:block lg:hover:bg-primary lg:hover:text-white lg:hover:border-primary active:bg-primary active:text-white active:border-primary" onclick="Cardapio.metodos.adicionarAoCarrinho('\${id}')">Adicionar ao pedido</button>
                </div>
            </div>
        `,

        itemCarrinho: `
            <div id="container-sacola-\${id}" class="flex flex-row justify-between p-2 \${border} border-gray-300 w-full items-center">
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
                        <button class="px-2" onclick="Cardapio.metodos.alterarQuantidadeCarrinho('\${id}', false)">-</button>
                        <div class="border-l-2 border-r-2 border-default w-7 sm:w-12 flex items-center justify-center">
                            <span id="qtd-sacola-\${id}" class="pointer-events-none select-none">\${qntd}</span>
                        </div>
                        <button id="item-btn-inc"class="px-2" onclick="Cardapio.metodos.alterarQuantidadeCarrinho('\${id}', true)">+</button>
                    </div>
                    <button class="ml-1 sm:ml-2" onclick="Cardapio.metodos.removerItemCarrinho('\${id}')">
                        <img class="h-6 w-6" src="./imgs/icon/trash.png" />
                    </button>
                </div>
            </div>
        `,

        itemResumo: `
            <div class="flex flex-row justify-between items-center \${border} border-gray-300 py-2">
                <div class="flex">
                    <div class="shrink-0">
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
        `,
    };

    const helpers = {
        debounce: (func, timeout = 300) => {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => { func(this, args); }, timeout);
            };
        },

        /**
         * Aplica um método a uma lista de elementos.
         *
         * @param {NodeList} nodeList - A lista de elementos a serem processados.
         * @param {string} metodo - O método a ser aplicado ('setAttr', 'rmAttr', 'addClass', 'rmClass'.).
         * @param {string} name - O nome da classe/atributo a ser considerado na operação.
         * @param {string|boolean} value - O valor do atributo a ser considerado na operação.
         */
        processNodeList: (nodeList, metodo, name, value = null) => {
            if (!nodeList) {
                console.error('nodeList is empty');
                return;
            };

            if (!value && metodo === 'setAttr') {
                console.error('value field is null.');
                return;
            };

            for (let i = 0; i < nodeList.length; i++) {
                switch (metodo) {
                    case 'setAttr':
                        nodeList[i].setAttribute(name, value);
                        break;
                    case 'rmAttr':
                        nodeList[i].removeAttribute(name);
                        break;
                    case 'addClass':
                        nodeList[i].classList.add(name);
                        break;
                    case 'rmClass':
                        nodeList[i].classList.remove(name);
                        break;
                    default:
                        console.error("'metodo' not found");
                        return;
                };
            };
        }
    };

    return {
        init,
        metodos,
    };
})();

const Toast = {
    create: (texto, cor = 'red', tempo = 2500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = Toast.templates.default
            .replace(/\${cor}/g, cor)
            .replace(/\${id}/g, id)
            .replace(/\${texto}/g, texto)

        document.querySelector('#toast-container').insertAdjacentHTML('beforeend', msg);

        setTimeout(() => {
            /* document.querySelector('#msg-' + id).classList.remove('fadeInDown');
            document.querySelector('#msg-' + id).classList.add('fadeOutUp'); */
            setTimeout(() => {
                document.querySelector('#msg-' + id).remove();
            }, 800);
        }, tempo)

    },

    close: (id) => {
        document.querySelector(`#${id}`).classList.add('hidden');
    },

    templates: {
        default: `
            <div data-color="\${cor}" id="msg-\${id}" class="relative data-[color=red]:bg-red-400 data-[color=green]:bg-green-400 data-[color=yellow]:bg-yellow-400 text-white p-2 sm:px-4 sm:py-3 mt-1 sm:mt-2 rounded-lg shadow-xl">
                <p class="pointer-events-none select-none">\${texto}</p>
                <button class="absolute top-0 right-1 text-xs p-1" onclick="Toast.close('msg-\${id}')">X</button>
            </div>
        `,
    }
};
