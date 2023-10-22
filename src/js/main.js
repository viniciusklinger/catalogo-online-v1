window.onload = function () {
    Cardapio.init();
};

const LocalStorage = (function (){
    const storage = window.localStorage;

    /**
     * Sets a new key/value pair in the storage ('value' will be stringified).
     * 
     * @param {string} name - The key for the item to be stored: 'meuCarrinho' or 'deliveryData'.
     * @param {any} value - The value to be stored (will be stringified).
     */
    function set(name, value) {
        try {
            let stringified = JSON.stringify(value)
            storage.setItem(name, stringified);
        } catch (er) {
            console.error('Erro ao definir item no localStorage: ', er);
        }
    };

    /**
     * Updates the current key/value pair in the storage by merging with a new value ('value' will be spread).
     * 
     * @param {string} name - The key for the item to be updated: 'meuCarrinho' or 'deliveryData'.
     * @param {object} value - An object containing values to merge with the existing data.
     */
    function update(name, value) {
        try {
            let oldValue = getParsed(name);
            let newValue = {...oldValue, ...value };
            set(name, newValue);
        } catch (er) {
            console.error('Erro ao definir item no localStorage:', er);
        }
    };
    
    /**
     * Returns the parsed value associated with the given key.
     * 
     * @param {string} key - The key to retrieve: 'meuCarrinho' or 'deliveryData'.
     * @returns {any} The parsed value, or null if not found.
     */
    function getParsed(key) {
        let data = storage.getItem(key);
        if (!data) return null;
        return JSON.parse(data);
    };

    /**
     * Remove all values of localStorage.
     */
    function clear() {
        storage.clear();
    };

    return {
        set,
        getParsed,
        update,
    }
})();

const MapsServices = (function () {
    let renderedMap;
    let marker;
    let infoWindow;
    let directionsService;
    let geoCoder;
    let debouncer;

    async function init() {
        if (renderedMap) return;

        try {
            const [mapsLibrary, markerLibrary] = await Promise.all([
                google.maps.importLibrary("maps"),
                google.maps.importLibrary("marker"),
                ]);

            const { Map, InfoWindow } = mapsLibrary;
            const { Marker } = markerLibrary;

            const lastSessionData = LocalStorage.getParsed('deliveryData')
            let startingPosition = lastSessionData?.latLng ? lastSessionData?.latLng : CustomData.storeLatLng

            renderedMap = new Map(document.getElementById("delivery-map"), {
                zoom: lastSessionData?.latLng ? 15 : 13,
                center: startingPosition,
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
                position: startingPosition,
                animation: google.maps.Animation.DROP,
                map: renderedMap,
                draggable: true,
                clickable: false,
            });
            infoWindow = new InfoWindow();
            if (lastSessionData?.retirar == false) toggleInfoWindow(true);
            attachEvents();

        } catch (e) {
            console.error(e)
            Toast.create("Erro ao iniciar o serviço de mapas.")
        };
    };

    async function initGeocoder() {
        const { Geocoder } = await google.maps.importLibrary("geocoding")
        geoCoder = new Geocoder();
    };
    
    async function initDirectionsService() {
        const { DirectionsService } = await google.maps.importLibrary("routes");
        directionsService = new DirectionsService();
    };

    function attachEvents() {
        google.maps.event.addListener(renderedMap, 'click', async function (event) {
            if (debouncer && (Date.now() - debouncer) < 1500 ) return;
            debouncer = Date.now();
            marker.setPosition(event.latLng);
            const [directionsData, cep] = await getDirectionsData(marker.getPosition());
            updateCardapioValues(directionsData, cep);
            LocalStorage.update('deliveryData', {latLng: marker.getPosition()});

            window.setTimeout(() => {
              renderedMap.panTo(event.latLng);
            }, 400);
        });

        marker.addListener("dragend", async (event) => {
            const [directionsData, cep] = await getDirectionsData(marker.getPosition());
            updateCardapioValues(directionsData, cep);
            LocalStorage.update('deliveryData', {latLng: marker.getPosition()});
        });
    };

    async function Geocode(address) {
        if (!geoCoder) await initGeocoder();
        return await geoCoder.geocode({address});
    };

    async function reverseGeocode(latLng){
        if (!geoCoder) await initGeocoder();
        return await geoCoder.geocode({location: latLng, region: "BR"});
    };

    /**
     * Calculates the distance, duration, and route information between the current location
     * and a specified destination using the Google Directions API.
     *
     * @param {object} LatLng - Destination coordinates in the format { lat: float, lng: float }.
     * @param {boolean} outZoom - Controls whether to zoom out the map, default is false.
     * @param {boolean} resetNumber - Controls whether to reset the postal code number, default is false.
     * @throws {string} Throws an error message in case of API request failure.
     */
    async function getDirectionsData(LatLng, outZoom = false) {
        return new Promise(async (resolve, reject) => {
            if (!directionsService) await initDirectionsService();
            
            /* const resTeste = await OpenRouteServices.getDirections(LatLng);
            console.log('openRouteDir: ', resTeste); */

            const route = {
                origin: CustomData.storeLatLng,
                destination: LatLng,
                travelMode: 'DRIVING',
                language: '	pt-BR',
            };
            console.log('Fetching directions API...');
            directionsService.route(route, function(res, status) {
                if (status != 'OK') {
                    let msg = status == 'OVER_QUERY_LIMIT' ? 'Este recurso foi temporariamente bloqueado. Preencha os campos manualmente ou aguarde alguns minutos para usar novamente.' : status;
                    Toast.create(msg, 'red', 7500);
                    reject(msg);
                };

                let directionsData = res?.routes[0]?.legs[0];
                if (!directionsData) {
                    reject('Directions request failed.');
                }
                const cep = directionsData.end_address.match(/(\d{5}-\d{3})/)[1] ?? null;
                resolve([directionsData, cep]);
            });
        });
    };

    function setMarkerPosition(LatLng, content = true, outZoom = false) {
        if(!renderedMap) init();
        if (outZoom) renderedMap.setZoom(13);
        marker.setPosition(LatLng);
        if (content) {
            toggleInfoWindow(true);
        } else {
            setMarkerProps('drag', false);
            toggleInfoWindow(false);
        };
        window.setTimeout(() => {
            renderedMap.panTo(LatLng);
            renderedMap.setZoom(15);
        }, 1200);
    };

    function setMarkerProps(name, value) {
        switch (name) {
            case 'drag':
                marker.setDraggable(value);
                break;
            default:
                console.error('Marker prop not found.');
        };
    };

    function toggleInfoWindow(open) {
        if (open) {
            infoWindow.setContent("Clique no mapa ou arraste o PIN para posicioná-lo.");
            infoWindow.open(renderedMap, marker);
        } else {
            infoWindow.close();
        }
    }

    function setMapProps(name, value) {
        switch (name) {
            case 'zoom':
                renderedMap.setZoom(value)
                break;
            default:
                console.error('Map prop not found.');
        };
    };

    function handleErrorsMsg(resStatus){
        switch (resStatus) {
            case "ERROR":	
                return "houve um problema no contato com os servidores da Google.";
            case "INVALID_REQUEST":	
                return "Esta GeocoderRequest era inválida."
            case "OK":	
                return "A resposta contém um GeocoderResponse válido."
            case "OVER_QUERY_LIMIT":	
                return "A página web ultrapassou o limite de solicitações em um período muito curto."
            case "REQUEST_DENIED":	
                return "A página web não tem permissão para usar o geocodificador."
            case "UNKNOWN_ERROR":	
                return "Não foi possível processar uma solicitação de geocodificação devido a um erro no servidor. Se você tentar novamente, a solicitação poderá dar certo."
            case "ZERO_RESULTS":	
                return "Nenhum resultado encontrado para GeocoderRequest."
        }
    };

    function updateCardapioValues(directionsData, cep, resetNumber = false){
        Cardapio.metodos.calcularValorEntrega({distance: directionsData.distance.value, duration: directionsData.duration.value});
        Cardapio.metodos.AtualizarValoresTotais();
        Cardapio.metodos.buscarCep(cep);
    };

    return {
        init,
        getDirectionsData,
        setMarkerPosition,
        setMarkerProps,
        setMapProps,
        Geocode,
        toggleInfoWindow,
        reverseGeocode,
    };

})();

const OpenRouteServices = (function () {
    async function getGeocode(endereco) {
        const link = `https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf624821f64896b9914c479bd90fb27e88e1a7&text=${endereco}&boundary.country=BRA&size=1&focus.point.lat=${CustomData.storeLatLng.lat}&focus.point.lon=${CustomData.storeLatLng.lng}&boundary.circle.lat=${CustomData.storeLatLng.lat}&boundary.circle.lon=${CustomData.storeLatLng.lng}&boundary.circle.radius=${CustomData.storeLatLng.radius}`
        try {
            const res = await fetch(link)
            const data = await res.json();
        } catch (e) {
            console.error(e);
            Toast.create('O serviço de geolocalização falhou.', 'red', 5000);
        }
    };
    
    async function getDirections(data) {
        const latlng = data.toJSON();
        const start = `${CustomData.storeLatLng.lng},${CustomData.storeLatLng.lat}`;
        const end = `${latlng.lng},${latlng.lat}`
        const link = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624821f64896b9914c479bd90fb27e88e1a7&start=${start}&end=${end}`;
        try {
            const res = await fetch(link)
            const data = await res.json();
        } catch (e) {
            console.error(e);
            Toast.create('O serviço de cálculo de frete falhou.', 'red', 5000);
        }
    };

    return {
        getGeocode,
        getDirections,
    };
})();

const Cardapio = (function () {
    let meuCarrinho = LocalStorage.getParsed('meuCarrinho') ?? [];
    let deliveryData = LocalStorage.getParsed('deliveryData') ?? {value: 0, maxValue: false, duration: 0, takeout: false, dinein:false, map: false};
    /* let locationPermission; */

    function init() {
        metodos.obterItensCardapio();

        document.querySelector('#data-cep').addEventListener('input', (Helpers.debounce(metodos.buscarCep(""))));
        document.querySelector('#data-complemento').addEventListener('input', (Helpers.debounce(metodos.validarEndereco, 1000)));
        document.querySelector('#data-numero').addEventListener('input', (Helpers.debounce(metodos.handleNumero, 1000)));
        document.querySelector('#btn-use-location-service').addEventListener('click', (Helpers.debounce(metodos.getUserLocation)));
        document.querySelector('#endereco-label').setAttribute('data-endereco', CustomData.address.join(', '));
        document.querySelector('#link-loja-maps').href = CustomData.mapsMagLink;
        document.querySelector('#maps-embed').src = CustomData.mapsEmbed;
        document.querySelector('#btn-zap').href = `https://wa.me/${CustomData.zapNumber}?text=${encodeURI(CustomData.zapHelpText)}`;
        document.querySelector('#btn-tel-contato').href = `tel:${CustomData.phoneNumber}`;
        document.querySelector('#btn-tel-label').textContent = CustomData.formatedPhoneNumber;
        document.querySelector('#goto-zap-btn').href = `https://wa.me/${CustomData.zapNumber}?text=${encodeURI(CustomData.zapHelpText)}`;
        document.querySelector('#goto-insta-btn').href = `${CustomData.instaLink}`;
        document.querySelector('#goto-face-btn').href = `${CustomData.faceLink}`;
        document.querySelector('#goto-zap-btn2').href = `https://wa.me/${CustomData.zapNumber}?text=${encodeURI(CustomData.zapHelpText)}`;
        document.querySelector('#goto-insta-btn2').href = `${CustomData.instaLink}`;
        document.querySelector('#goto-face-btn2').href = `${CustomData.faceLink}`;

        if (deliveryData.takeout == true) document.querySelector('#modal-carrinho').setAttribute('data-modo', 2);
        if (meuCarrinho.length > 0) {
            document.querySelector('#btn-carrinho').classList.remove('hidden');
            metodos.atualizarContadorCarrinho();
        };
        if (deliveryData?.address) {
            metodos.atualizarEndereco({...deliveryData.address});
            metodos.AtualizarValoresTotais();
        };
        if (deliveryData.map) {
            document.querySelector('#modal-carrinho').setAttribute('data-mapa', 'true');
        };

        /* navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
            locationPermission = permissionStatus.state
            permissionStatus.onchange = () => {
                locationPermission = permissionStatus.state;
            };
        }); */

    };

    const metodos = {
        obterItensCardapio: (categoria = 'burgers', vermais = false) => {

            var filtro = MenuLoja[categoria];
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
                    document.querySelector('#itens-cardapio').insertAdjacentHTML('beforeend', temp)
                }

                // paginação inicial (mostra 8 itens)
                if (!vermais && i < (step === 6 ? 6 : 8)) {
                    document.querySelector('#itens-cardapio').insertAdjacentHTML('beforeend', temp)
                }
            })

            // seta estados
            if (document.querySelector('#itens-cardapio').children.length == filtro.length) {
                document.querySelector('#btn-ver-mais').classList.add('hidden');
            };

            let botoes = document.querySelectorAll('.cardapio-menu > button');
            Helpers.processNodeList(botoes, 'setAttr', 'data-active', 'false');
            document.querySelector('#cardapio-btn-' + categoria).setAttribute("data-active", 'true');

        },

        verMais: () => {
            let cat = document.querySelector('.cardapio-menu > [data-active="true"]').getAttribute("id").split('cardapio-btn-')[1];
            Cardapio.metodos.obterItensCardapio(cat, true);
        },

        adicionarAoCarrinho: (id) => {
            let cat = document.querySelector('#menu-cardapio > [data-active="true"]').getAttribute("id").split('cardapio-btn-')[1];
            let existe = meuCarrinho.filter( el => el.id == id);
            
            let item = MenuLoja[cat].filter(el => el.id == id)[0] ?? null;
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
                meuCarrinho.push(temp);
            } else {
                existe[0].qtd += 1;
            }
            LocalStorage.set('meuCarrinho', meuCarrinho);

            Toast.create('Adicionado ao carrinho!', 'green');
            document.querySelector('#btn-carrinho').classList.remove('hidden');
            Cardapio.metodos.atualizarContadorCarrinho();
        },

        atualizarContadorCarrinho: () => {
            const total = meuCarrinho.length > 0 ? meuCarrinho.reduce((acc, e) => {return acc + e.qtd}, 0) : 0;
            document.querySelector('#cart-counter').textContent = total;
        },

        abrirCarrinho: (abrir) => {

            if (abrir) {
                metodos.renderizarCarrinho();
                document.querySelector('#modal-carrinho').classList.remove('hidden');
                /* block scrolling on body */
                document.querySelector('#body-data').setAttribute('data-modal', 'open');
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
            if (meuCarrinho.length > 0) {
                document.querySelector('#default-view').classList.add('hidden');
                meuCarrinho.forEach((item, i) => {
                    let temp = templates.itemCarrinho.replace(/\${img}/g, item.img)
                    .replace(/\${nome}/g, item.name)
                    .replace(/\${preco}/g, item.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, item.id)
                    .replace(/\${qntd}/g, item.qtd)
                    .replace(/\${border}/g, i+1 == meuCarrinho.length ? '' : 'border-b')

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

            const selectedItem = meuCarrinho.filter(el => el.id == id)[0];
            if (!selectedItem) {
                console.error('ID não encontrado no carrinho.');
                return;
            }
            selectedItem.qtd = newValue
            selectedItemElement.textContent = newValue

            LocalStorage.set('meuCarrinho', meuCarrinho);

            metodos.AtualizarValoresTotais();
            metodos.atualizarContadorCarrinho();
        },

        removerItemCarrinho: (id) => {
            let updatedCart = meuCarrinho.filter(el => el.id != id);
            if (meuCarrinho.length == updatedCart.length) {
                console.error('ID não encontrado no carrinho.');
                return;
            }
            meuCarrinho = updatedCart
            document.querySelector(`#container-sacola-${id}`).remove();
            Cardapio.metodos.AtualizarValoresTotais();
            Cardapio.metodos.atualizarContadorCarrinho();
            LocalStorage.set('meuCarrinho', meuCarrinho);
            if (updatedCart.length == 0) {
                document.querySelector('#default-view').classList.remove('hidden');
                document.querySelector('#btn-carrinho').classList.add('hidden');
            };
            
        },

        AtualizarValoresTotais: () => {
            let valorCarrinho = meuCarrinho.length > 0 ? meuCarrinho.reduce((acc, e) => {return acc + (e.qtd * e.price)}, 0) : 0;
            document.querySelector('#cart-subtotal').textContent = `R$ ${valorCarrinho.toFixed(2).replace('.', ',')}`;
            document.querySelector('#cart-total').textContent = `R$ ${(valorCarrinho + ((deliveryData.takeout == false && deliveryData.value) ? deliveryData.value : 0)).toFixed(2).replace('.', ',')}`;
            document.querySelector('#cart-entrega').textContent = `+ R$ ${(deliveryData.takeout == false && deliveryData.value) ? deliveryData.value.toFixed(2).replace('.', ',') : (0).toFixed(2).replace('.', ',')}`;
            if (deliveryData.maxValue && deliveryData.takeout == false) {
                document.querySelector('#entrega-label').setAttribute('data-max', 'true');
            } else {
                document.querySelector('#entrega-label').removeAttribute('data-max'); 
            }
        },

        navegarEtapa: (direcao) => {
            let current = parseInt(document.querySelector('#modal-carrinho').getAttribute('data-etapa'))
            let newEtapa = Math.max(current + (direcao == 'true' ? 1 : -1), 1);

            if (newEtapa == 2) {
                if (meuCarrinho.length == 0) {
                    Toast.create('Sua sacola está vazia.')
                    return;
                };
                if(deliveryData.map) MapsServices.init();
            } else if (newEtapa == 3) {
                let modo = document.querySelector('#modal-carrinho').getAttribute('data-modo')
                if (modo == 1) {
                    if (!Cardapio.metodos.validarEndereco()) return;
                }
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

        buscarCep: async (cep = "") => {
            const rawCep = cep != "" ? cep : document.querySelector('#data-cep').value.trim();
            const formattedCep = rawCep.replace(/\D/g, '');

            if (formattedCep != "") {
                let validacep = /^[0-9]{8}$/;
                if (validacep.test(formattedCep)) {
                    document.querySelector('#delivery-view').setAttribute('data-loading', 'true');
                    try {
                        const res = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`)
                        const data = await res.json();
                        metodos.atualizarEndereco({endereco: data.logradouro, bairro: data.bairro, cidade: data.localidade, uf: data.uf, cep: rawCep, complemento: "", numero: ""});

                    } catch (e) {
                        console.error(e);
                        Toast.create('CEP não encontrado. Preencha as informações manualmente ou tente novamente.', 'red', 5000);
                    } finally {
                        document.querySelector('#delivery-view').removeAttribute('data-loading');
                    };
                };
            };

        },

        validarEndereco: () => {
            let cep = document.querySelector('#data-cep').value.trim();
            let endereco = document.querySelector('#data-endereco').value.trim();
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
                document.querySelector('#data-endereco').focus();
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

            deliveryData.address = {
                cep: cep,
                endereco: endereco,
                bairro: bairro,
                cidade: cidade,
                uf: uf,
                numero: numero,
                complemento: complemento
            };
            LocalStorage.update('deliveryData', deliveryData);
            return true
        },

        handleNumero: async () => {
            if (!metodos.validarEndereco()) return;
            const {endereco, numero, bairro, cidade, uf, cep} = deliveryData.address;
            /* const data = await OpenRouteServices.getGeocode(`${endereco}, ${numero}, ${bairro} - ${cidade}, ${uf} ${cep}`); */
            const geocodeData = await MapsServices.Geocode(`${endereco}, ${numero}, ${bairro} - ${cidade}, ${uf} ${cep}`);
            const latLng = geocodeData ? geocodeData.results[0].geometry.location : null;
            if (!latLng) {
                Toast.create('Erro, local não encontrato. Por favor, tente novamente.', 'red', 2500)
            }
            const [directionsData, cep2] = await MapsServices.getDirectionsData(latLng, true, true);
            metodos.calcularValorEntrega({distance: directionsData.distance.value, duration: directionsData.duration.value});
            metodos.AtualizarValoresTotais();
            LocalStorage.update("deliveryData", {latLng: latLng});

            if (deliveryData.map == true) {
                MapsServices.setMarkerPosition(latLng);
            };
        },

        carregarResumo: () => {
            document.querySelector('#resumo-items-pedido').innerHTML = '';

            meuCarrinho.forEach((e, i) => {
                let temp = templates.itemResumo.replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${preco}/g, (e.price * e.qtd).toFixed(2).replace('.', ','))
                    .replace(/\${qntd}/g, e.qtd)
                    .replace(/\${border}/g, i+1 == meuCarrinho.length ? '' : 'border-b')
                document.querySelector('#resumo-items-pedido').insertAdjacentHTML('beforeend', temp);
            })

            let modo = document.querySelector('#modal-carrinho').getAttribute('data-modo')
            if (modo == 1) {
                const {endereco, numero, bairro, cidade, uf, cep, complemento} = deliveryData.address;
                document.querySelector('#resumo-endereco').innerHTML = (`${endereco}, ${numero}, ${bairro}`);
                document.querySelector('#resumo-endereco-2').innerHTML = (`${cidade}-${uf} / ${cep}${complemento ? " - " + complemento : ""}`);
            } else {
                document.querySelector('#resumo-endereco').innerHTML = CustomData.address[0];
                document.querySelector('#resumo-endereco-2').innerHTML = CustomData.address[1];
            };
        },

        finalizarPedido: () => {
            if (meuCarrinho.length > 0) {
                let modo = document.querySelector('#modal-carrinho').getAttribute('data-modo');
                let valorCarrinho = meuCarrinho.length > 0 ? meuCarrinho.reduce((acc, e) => {return acc + (e.qtd * e.price)}, 0) : 0;

                let texto = 'Olá! gostaria de fazer um pedido:';
                texto += `\n\n\${itens}`;
                if (modo == 1) {
                    if (!deliveryData?.address) return;
                    const {endereco, numero, bairro, cidade, uf, cep, complemento} = deliveryData.address;
                    texto += '\n*Endereço de entrega:*';
                    texto += `\n${endereco}, ${numero}, ${bairro}`;
                    texto += `\n${cidade}-${uf} / ${cep} ${complemento}`;
                    texto += `\n\nEntrega: R$ ${deliveryData.value.toFixed(2).replace('.', ',')}`;
                } else {
                    texto += '\n*Endereço para retirada:*';
                    texto += `\n${CustomData.mapsMagLink}`;
                    texto += `\n${CustomData.address.join(', ')}\n`;
                };
                texto += `\n*Total: R$ ${(valorCarrinho + (deliveryData.takeout == false ? deliveryData.value : 0)).toFixed(2).replace('.', ',')}*`;

                let itens = '';
                meuCarrinho.forEach((el, i) => {
                    itens += `*${el.qtd}x* ${el.name} ....... R$ ${(el.price * el.qtd).toFixed(2).replace('.', ',')}\n`;
                });
                meuCarrinho = [];
                metodos.atualizarContadorCarrinho();
                document.querySelector('#btn-carrinho').classList.add('hidden');
                metodos.abrirCarrinho(false)
                metodos.AtualizarValoresTotais();
                LocalStorage.set('meuCarrinho', null);

                texto = texto.replace(/\${itens}/g, itens);
                let encoded = encodeURI(texto);
                let URL = `https://wa.me/${CustomData.zapNumber}?text=${encoded}`;
                window.open(URL, '_blank');
            };
        },

        CarregarDepoimento: (ind) => {
            const imgEl = document.querySelector('#dep-img');
            const nameEl = document.querySelector('#dep-name');
            const starsEl = document.querySelector('#dep-stars');
            const textEl = document.querySelector('#dep-text');

            const star = `<div class="bg-star h-4 w-4 bg-cover"></div>`;
            const hstar = `<div class="bg-h-star h-4 w-4 bg-cover"></div>`

            const selected = Depoimentos[ind];

            imgEl.src = selected.path;
            nameEl.textContent = selected.name;
            textEl.textContent = selected.text;

            starsEl.innerHTML = '';
            starsEl.insertAdjacentHTML('beforeend', star.repeat(Math.floor(selected.value)));
            starsEl.insertAdjacentHTML('beforeend', selected.value % 1 != 0 ? hstar : '');
            starsEl.insertAdjacentHTML('beforeend', `<span>${selected.value}</span>`);
        }, 

        handleCardExpansion: (el) => {
            let renderedCards = document.querySelector('#itens-cardapio').children;
            Helpers.processNodeList(renderedCards, 'rmAttr', 'data-expand');
            let viewport =  window.innerWidth;

            if (viewport < 640) {
                el.setAttribute('data-expand', 'true');
            };
        },

        handleDeliveryMode: (mode) => {
            document.querySelector('#modal-carrinho').setAttribute('data-modo', mode);
            document.querySelector('#modo-entrega-label').setAttribute('data-label', mode == 1 ? 'Local de Entrega' : 'Local de Retirada');
            if (mode == 2) {
                if (deliveryData.map == true) {
                    MapsServices.setMarkerPosition(CustomData.storeLatLng, false, true);
                };
                deliveryData.takeout = true;
                LocalStorage.update('deliveryData', {takeout: true, map: false});
                metodos.AtualizarValoresTotais();
            } else {
                deliveryData.takeout = false;
                LocalStorage.update('deliveryData', {takeout: false});
                metodos.AtualizarValoresTotais();
                if (deliveryData.map == true) {
                    MapsServices.setMarkerPosition(deliveryData.latLng, true, false);
                };
            };
        },

        atualizarEndereco({cep = null, endereco = null, bairro = null, cidade = null, uf = null, numero = null, complemento = null}) {
            const campos = ['cep', 'endereco', 'bairro', 'cidade', 'uf', 'numero', 'complemento']
            const address = {};
            campos.forEach((el, i) => {
                let value = arguments[0][el];
                if (value != null) {
                    document.querySelector(`#data-${el}`).value = value;
                    address[el] = value;
                }
            });
            LocalStorage.update("deliveryData", {address})
            return;
        },

        async handleGeocode() {
            if (!metodos.validarEndereco()) return;
            const {endereco, numero, bairro, cidade, uf, cep} = deliveryData.address;
            const data = await OpenRouteServices.getGeocode(`${endereco}, ${numero}, ${bairro} - ${cidade}, ${uf} ${cep}`);
            /* const data = await MapsServices.Geocode(`${endereco}, ${numero}, ${bairro} - ${cidade}, ${uf} ${cep}`); */
            MapsServices.getDirectionsData(data.results[0].geometry.location, false);
            MapsServices.setMarkerPosition(data.results[0].geometry.location, true);
            Cardapio.metodos.calcularValorEntrega({distance: directionsData.distance.value, duration: directionsData.duration.value});
            Cardapio.metodos.AtualizarValoresTotais();
        },

        /**
         * Calcula o valor da Entrega
         *
         * @param {object} data - Object = { distance: meters, duration: seconds}.
         */
        calcularValorEntrega(data) {
            if (!data || !data?.distance || !data?.duration) {
                deliveryData = {...deliveryData, value: 0, maxValue: false, duration: 0};
                LocalStorage.update('deliveryData', deliveryData);
                return;
            };

            let distance = data.distance / 1000;
            let duration = data.duration;
            let taxa = 0

            for (const [dist, valor] of Object.entries(CustomData.delivery.distance.values)) {
                if (distance < dist) {
                    taxa = valor;
                    break;
                }
            }
            deliveryData.value = (distance * 2) * taxa;
            deliveryData.maxValue = (distance * 2) * taxa > 25 ? true : false;
            deliveryData.duration = duration
            LocalStorage.update('deliveryData', deliveryData);
        },

        async getUserLocation(){
            const pos = await Helpers.getGeolocation();
            if (!pos) return;
            
            const [directionsData, cep] = await MapsServices.getDirectionsData(pos, true, true);
            metodos.calcularValorEntrega({distance: directionsData.distance.value, duration: directionsData.duration.value});
            metodos.AtualizarValoresTotais();
            metodos.buscarCep(cep);
            LocalStorage.update("deliveryData", {latLng: pos});

            if (deliveryData.map == true) {
                MapsServices.setMarkerPosition(latLng);
            };
        },

        initMap() {
            let modalCarrinho = document.querySelector('#modal-carrinho')
            modalCarrinho.setAttribute('data-mapa', 'true');
            MapsServices.init();

        },
    };

    const templates = {
        item: `
            <div id="\${id}" class="bg-white w-11/12 max-w-sm sm:w-[255px] p-2 shadow-md rounded-2xl max-h-[110px] sm:max-h-[360px] xs:max-h-32 sm:h-[360px] group data-[expand=true]:max-h-[290px] xs:data-[expand=true]:max-h-96 sm:hover:h-[360px] flex flex-row sm:block transition-all mb-3 overflow-hidden mx-auto" onclick="Cardapio.metodos.handleCardExpansion(this)">
                <div class="h-20 w-20 xs:h-24 xs:w-24 sm:h-56 sm:w-56 bg-gray-200 rounded-xl m-2 shrink-0 group-data-[expand=true]:hidden sm:group-hover:hidden">
                    <img src="\${img}" alt="imagem do lanche" class="rounded-xl">
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
                        <img src="\${img}" alt="imagem do lanche" class="rounded-xl">
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
                        <img class="h-6 w-6" src="./imgs/icon/trash.png" alt="icone lixeira"/>
                    </button>
                </div>
            </div>
        `,

        itemResumo: `
            <div class="flex flex-row justify-between items-center \${border} border-gray-300 py-2">
                <div class="flex">
                    <div class="shrink-0">
                        <img class="h-12 w-12 rounded-xl" src="\${img}" alt="imagem do lanche"/>
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

        depoimento: `
        
        `,
    };

    return {
        init,
        metodos,
    };
})();

const Analytics = (function (){
    const measurement_id = `G-H5VZ5EZ4MD`;
    const api_secret = `zgaRqlkBReK4DYmK69gLsQ`;

    async function testEvent() {
        let res = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
            method: "POST",
            body: JSON.stringify({
              client_id: 'cardapio-app',
              user_id: 'nome-da-loja',
              events: [{
                name: 'maps_service',
                params: {
                    'name': 'map_load',
                    'value': 'teste',
                },
              }]
            })
        });
        Toast.create(res.status , 'green');
    };

    return {
        testEvent,
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
                <button class="absolute top-0 right-1 text-[8px] md:text-xs p-1" onclick="Toast.close('msg-\${id}')">X</button>
            </div>
        `,
    }
};

const Helpers = {
    /**
     *
     * @param {any} func - A função a ser executada.
     * @param {number} timeout - Default = 300ms.
     */
    debounce: (func, timeout = 350) => {
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
    },

    handleLocationErrorMsg(browserHasGeolocation) {
        let msg = browserHasGeolocation ? "O serviço de Geolocalização falhou ou a permissão de acesso foi negada." : "Seu navegador não suporta Geolocalização.";
        Toast.create(msg)
    },

    getGeolocation(){
        return new Promise((resolve, reject) => {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    resolve(pos);
                },
                () => {
                    const msg = Helpers.handleLocationErrorMsg(true);
                    reject(msg);
                },
            );
            } else {
                const msg = Helpers.handleLocationErrorMsg(false);
                reject(msg);
            };
        });
    },
};