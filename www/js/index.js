
storage = window.localStorage;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();

// calc

$('#calculate').click(function(){
    if($('#calculate-form').valid()){
        var totalAmount = $('#totalAmount').val();
        var nicotineStrength = $('#nicotineStrength').val();
        var liquidStrength = $('#liquidStrength').val();

        var nicotineNeeded = (liquidStrength/nicotineStrength)*totalAmount;

        if(totalAmount >= nicotineNeeded){
            var result = 'Et saada ' + totalAmount + 'ml ' + liquidStrength + 'mg vedelikku, pead vedelikule lisama ' + nicotineNeeded.toFixed(2) + 'ml nikotiini baasi.';
        } else {
            var result = 'Sellist vedelikku pole võimalik segada!';
        }

    } else {
        var result = 'Igas väljas peab olema number (suurem kui 0)!';
    }

    $('#result').html(result);
});

// add

$('#addrecipe-button').click(function(){
    var recipes = [];

    if (storage.getItem('recipes') === null){
        storage.setItem('recipes', '');

    } else {
        $.each(getOld(), function(){
            recipes.push($(this)[0]);
        });
    }

    var newRecipe = {
        name: stripHTML($('#recipeName').val()),
        volume: stripHTML($('#recipeVolume').val()),
        description: stripHTML($('#recipeDescription').val()),
        components: getComponents()
    };

    recipes.push(newRecipe);

    var tmpStr = JSON.stringify(recipes);
    var jsonRecipes = tmpStr.substring(1, tmpStr .length-1);

    storage.setItem('recipes', jsonRecipes);
    listReload();

});

$('#addreciperow').click(function(){
    $('#addreciperow').before('<div class="form-group row"><div class="col-sm-10"><input type="text" class="form-control" placeholder="Komponent"></div></div>');
});

// view

var $recipeview = $('#recipe-view');

$recipeview.on('show.bs.modal', function(e) {
        var list = getOld();

        var button = e.relatedTarget;
        var item = button.id;

        $(this).find('.modal-title').html(list[item].name);
        $(this).find('#deleteBtn').html('<button type="button" class="btn btn-danger" data-item="'+ item +'" id="deleteRecipe">Kustuta</button>');



        $('#recipeview-name').html(list[item].name);
        $('#recipeview-volume').html(list[item].volume);
        $('#recipeview-description').html(list[item].description);
        $('#recipeview-components').html('');

        $(list[item].components).each(function(){
            $('#recipeview-components').append('<li class="list-group-item">' + this + '</li>');
        });

});

// delete

$('#deleteBtn').on('click', '#deleteRecipe',function(){
    var recipes = [];
    var item = $(this).data('item');

    if (storage.getItem('recipes') === null){
        storage.setItem('recipes', '');

    } else {
        $.each(getOld(), function(){
            recipes.push($(this)[0]);
        });
    }
        recipes.splice(item, 1);
        var tmpStr = JSON.stringify(recipes);
        var jsonRecipes = tmpStr.substring(1, tmpStr .length-1);

        storage.setItem('recipes', jsonRecipes);
        listReload();
        $recipeview.modal('toggle');

});


// helpers

function listReload(){
    var recipes = getOld();
    $('#recipe-list').html('');
    $.each(recipes, function(index){
        $('#recipe-list').append('<button type="button" class="list-group-item list-group-item-action" data-toggle="modal" data-target="#recipe-view" id="'+ index +'">'+ $(this)[0]['name'] +'</button>');
    });
}

function getOld(){
    return JSON.parse('[' + storage.getItem('recipes') + ']');
}


function getComponents() {
    var components = [];
    $('#components input').each(function() {
        components.push(stripHTML($(this).val()));
    });
    return components;
}

function stripHTML(dirtyString) {
    var container = document.createElement('div');
    var text = document.createTextNode(dirtyString);
    container.appendChild(text);
    return container.innerHTML;
}

//

$(document).ready(function () {

    $('#calculate-form').validate({
        rules: {
            totalAmount: {
                min: 1,
                required: true
            },
            nicotineStrength: {
                min: 1,
                required: true
            },
            liquidStrength: {
                min: 1,
                required: true
            }
        },
        highlight: function (element) {
            $(element).removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        }
    });

    if(storage.getItem('recipes') !== null){
        listReload();
    }
});