// 1- Added prodRange.price instead of prodRange
// 2- Added a priceField class in the HTML for #numElev_2
// 3- Was missing a else/if for #numFloors
// 4- Added getInfoNumApp();
// 5- i erased the numpark val in commercial
// 6- Was missing a numberElev:numElev for commercial
// 7- was written commercial instead of corporate
// 8- Was missing a hybrid section
// 9- wrong number 
// 10- correct from standart to standard




$(document).ready(function () {
    $("#numElev_2, #numElev_3, #elevPriceUnit, #elevTotal, #installationFee, #total_").attr('readonly', true);

    var numApp, numFloors, numBase, maxOcc;
    var prodRange = {
        type: null,
        price: null,
        installationFeePercentage: null
    };

    $('.formField').on('keyup', function () {
        doCalc();
    });

    // 10- correct from standart to standard, 1- and -10 getprodrange function replaced
    $('#standard, #premium, #excelium').on('click', function () {
        document.getElementById('elevPriceUnit').value = (getProdRange()).toFixed(2) + " $";
        doCalc();
    });

    $('#residential, #commercial, #corporate, #hybrid').on('click', function () {
        initialize();
    });


    function initialize() {
        $('.formField').val('');
        $('.productRangeBtn').prop('checked', false);
    };
    // 4- 
    function getInfoNumApp() {
        numApp = $('#numApp').val();
    };

    function getInfoNumFloors() {
        numFloors = $('#numFloors').val();
    };

    function getInfoNumBase() {
        numBase = $('#numBase').val();
    };

    function getInfoNumElev() {
        numElev = $('#numElev').val();
    };

    function getInfoMaxOcc() {
        maxOcc = $('#maxOcc').val();
    };
    
    // 1- Added prodRange.price instead of prodRangestandard
    function getProdRange() {
        if ($('#standard').is(':checked')) {
            prodRange.type = "standard";
            prodRange.price = parseFloat(7565);
            prodRange.installationFeePercentage = 0.1;
            return prodRange.price;

        } else if ($('#premium').is(':checked')) {
            prodRange.type = "premium";
            prodRange.price = parseFloat(12345);// 9- wrong number 
            prodRange.installationFeePercentage = 0.13;
            return prodRange.price;

        } else if ($('#excelium').is(':checked')) {
            prodRange.type = "excelium";
            prodRange.price = parseFloat(15400);
            prodRange.installationFeePercentage = 0.16;
            return prodRange.price;
        } else {
            prodRange.type = null,
            prodRange.price = null,
            prodRange.installationFeePercentage = null
            return prodRange.price;
        }
    };

    function GetInfos() {
        getInfoNumFloors();
        getInfoNumBase();
        getInfoNumElev();
        getInfoMaxOcc();
        getProdRange();
        // 4- Added getInfoNumApp();
        getInfoNumApp();
    };

    function setRequiredElevatorsResult(finNumElev) {
        $("#numElev_2, #numElev_3").val(parseFloat(finNumElev));

    };
    
    
    function setPricesResults(finNumElev, roughTotal, installFee, total) {
        $("#elevTotal").val(parseFloat(roughTotal).toFixed(2) + " $");
        $("#installationFee").val(parseFloat(installFee).toFixed(2) + " $");
        $("#total_").val(parseFloat(total).toFixed(2) + " $");
        
    };
    // 2- Added a priceField class in the HTML for #numElev_2
    function emptyElevatorsNumberAndPricesFields() {
        $('#numElev_3').val('');
        $('.priceField').val('');
    };

    function createFormData(projectType) {
        return {
            numberApp: numApp,
            numberFloors: numFloors,
            numberBase: numBase,
            numberElev: numElev, // 6- Was missing a numberElev:numElev for commercial
            maximumOcc: maxOcc,
            productRange: prodRange,
            projectType: projectType
        }
    };

    function negativeValues() {
        if ($('#numApp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numApp').val('');
            return true

        } else if ($('#numBase').val() < 0) {

            alert("Please enter a positive number!");
            $('#numBase').val('');
            return true

        } else if ($('#numComp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numComp').val('');
            return true

        } else if ($('#numPark').val() < 0) {

            alert("Please enter a positive number!");
            $('#numPark').val('');
            return true

        } else if ($('#numElev').val() < 0) {

            alert("Please enter a positive number!");
            $('#numElev').val('');
            return true

        } else if ($('#numCorpo').val() < 0) {

            alert("Please enter a positive number!");
            $('#numCorpo').val('');
            return true

        } else if ($('#maxOcc').val() < 0) {

            alert("Please enter a positive number!");
            $('#maxOcc').val('');
            return true
          // 3- Was missing a else/if for #numFloors
        } else if ($('#numFloors').val() < 0) {

            alert("Please enter a positive number!");
            $('#numFloors').val('');
            return true

        } else {
            return false
        }
    };

    function apiCall(projectType) {
        //Getting numbers from quote
        GetInfos();

        //Preparing data for Api call
        formData = createFormData(projectType)

        $.ajax({
            type: "POST",
            // url: 'http://localhost:3000/api/quoteCalculation/', //for local testing
            url: 'https://rocketelevators-quote.herokuapp.com/api/quoteCalculation/',
            data: JSON.stringify(formData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                setRequiredElevatorsResult(data.finalNumElev);
                if (prodRange.type != null) {
                    setPricesResults(data.finalNumElev, data.subTotal, data.installationFee, data.grandTotal);
                }
            }
        });
    }
    
    function doCalc() {
        if ($('#residential').hasClass('active') && !negativeValues() && $('#numApp').val() && $('#numFloors').val()) {
            apiCall('residential')                                          //5- i erased the numpark val
        } else if ($('#commercial').hasClass('active') && !negativeValues() && $('#numElev').val()) {
            apiCall('commercial')
            
        } else if ($('#corporate').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#maxOcc').val()) {
            apiCall('corporate') // 7- was written commercial instead of corporate
          // 8- Was missing a hybrid section
        } else if ($('#hybrid').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#maxOcc').val()) {
            apiCall('hybrid');
        } else {
         
            emptyElevatorsNumberAndPricesFields();
        };
    };
});


