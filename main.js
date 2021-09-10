//criando classe Depesa

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validaDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }

        return true
    }
}

//criando classe Bd

class Banco {

    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return (parseInt(proximoId) + 1)
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarRegistro() {
        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {
        let filtroDespesas = Array()

        filtroDespesas = this.recuperarRegistro()

        console.log(filtroDespesas);
        console.log(despesa);

        if(despesa.ano != ''){
        filtroDespesas = filtroDespesas.filter(d => d.ano == despesa.ano)
        }

        if(despesa.mes != ''){
            filtroDespesas = filtroDespesas.filter(d => d.mes == despesa.mes)
        }

        if(despesa.dia != ''){
            filtroDespesas = filtroDespesas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo != ''){
            filtroDespesas = filtroDespesas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != ''){
            filtroDespesas = filtroDespesas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor != ''){
            filtroDespesas = filtroDespesas.filter(d => d.valor == despesa.valor)
        }

        return filtroDespesas
    }

    exlcuirDepesa(id) {
        localStorage.removeItem(id)
    }
}

let banco = new Banco()


function cadastraDespesa () {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor =  document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if (despesa.validaDados()) {
        banco.gravar(despesa)

        document.getElementById('titulo_modal').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('div_titulo_modal').className = 'modal-header text-success'
        document.getElementById('conteudo_modal').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('botao_modal').innerHTML = 'Voltar'
        document.getElementById('botao_modal').className = 'btn btn-success'

        $('#registraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {

        document.getElementById('titulo_modal').innerHTML = 'Erro ao incluir o registro'
        document.getElementById('div_titulo_modal').className = 'modal-header text-danger'
        document.getElementById('conteudo_modal').innerHTML = 'Erro ao gravar. Verifique se todos os campos foram preenchidos corretamente!'
        document.getElementById('botao_modal').innerHTML = 'Voltar e corrigir'
        document.getElementById('botao_modal').className = 'btn btn-danger'

        $('#registraDespesa').modal('show')
    }
    
}

function carregarDespeas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
        despesas = banco.recuperarRegistro()
    }

    let listaDespesas = document.getElementById('listaDespesas')

    listaDespesas.innerHTML = ''

    despesas.forEach(function(d) {

        
        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
        }

        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let botaoExcluir = document.createElement("button")
        botaoExcluir.className = 'btn btn-danger'
        botaoExcluir.innerHTML = '<i class = "fas fa-times"></i>'
        botaoExcluir.id = 'id_despesa' + d.id
        botaoExcluir.onclick = function() {
            let id = this.id.replace('id_despesa', '')

            banco.exlcuirDepesa(id)

            window.location.reload()
        }

        linha.insertCell(4).append(botaoExcluir)

        console.log(d);
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    

    let despesas = banco.pesquisar(despesa)

    carregarDespeas(despesas, true)
}