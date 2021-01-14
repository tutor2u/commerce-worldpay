function findClosestParent (startElement, fn) {
    var parent = startElement.parentElement;
    if (!parent) return undefined;
    return fn(parent) ? parent : findClosestParent(parent, fn);
}

function initWorldpay() {
    // Because this might get executed before Worldpay is loaded.
    if (typeof Worldpay === "undefined") {
        setTimeout(initWorldpay, 200);
    } else {
        var $wrapper = document.querySelector('.worldpay-form');;
        var $form = findClosestParent($wrapper, function(element) {
            return element.tagName === 'FORM';
        });
        var key = $wrapper.dataset.clientkey;

        $form.addEventListener("submit", function(e){
            if (e.currentTarget.querySelectorAll('input[name=worldpayToken]').length === 0) {
                e.preventDefault();
                Worldpay.submitTemplateForm();
                return false;
            }
        });

        Worldpay.useTemplateForm({
            clientKey: key,
            form:'paymentForm',
            paymentSection:'payment-section',
            display:'inline',
            reusable:true,
            saveButton: false,
            callback: function(obj) {
                if (obj && obj.token) {
                    var _el = document.createElement('input');
                    _el.value = obj.token;
                    _el.type = 'hidden';
                    _el.name = 'worldpayToken';
                    document.getElementById($form.id).appendChild(_el);
                    document.getElementById($form.id).submit();
                }
            }
        });

        // if ($('.modal').data('modal')) {
        //     $('.modal').data('modal').updateSizeAndPosition();
        // }
    }
}

initWorldpay();