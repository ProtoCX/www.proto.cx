function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
let customers = 0



$(document).ready(function() {
    let estimatedCost = 0
    let finalPrice = 0

    //Helper functions

    // const ShowCalcPrice = () => {
    //   if ($(window).width() > 991) {
    //     if ($('.calculator:visible').length <= 1) {
    //       $('.price-container').css({ display: 'none' })
    //     } else {
    //       $('.price-container').css({ display: 'block' })
    //     }
    //   } else return
    // }

    function updateUrlParams(key, value) {
        if ('URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search)
            searchParams.set(key, value)
            var newRelativePathQuery =
                window.location.pathname + '?' + searchParams.toString()
            history.pushState(null, '', newRelativePathQuery)
        }
    }

    // Function to handle tooltip click
    function handleTooltipClick() {
        if ($(window).width() < 992) {
            $(this).next('.tooltip-text').fadeToggle('slow', 'linear');
        }
    }

    // Function to handle custom check click
    function handleCustomCheckClick() {
        if ($('.custom-check:checked').length === 0 && !this.checked) {
            this.checked = true;
            return false;
        } else {
            $(this).closest('label').toggleClass('active');
            return true;
        }
    }

    // Event handlers
    $('.tooltip-question').on('click', handleTooltipClick);
    $('.custom-check').on('click', handleCustomCheckClick);




    $('.pricing-addons-wrapper').ready(function() {
        const checkboxes = document.getElementsByClassName('selectable-check')
        var checkboxArray = Array.from(checkboxes)
        checkboxArray.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                var selectedValues = []
                checkboxArray.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        selectedValues.push(checkbox.value)
                    }
                })
                var queryString = selectedValues.join(',')
                updateUrlParams('addons', queryString)
            })
        })

        let searchParams = new URLSearchParams(window.location.search)
        if (searchParams.has('addons')) {
            let params = searchParams
                .get('addons')
                .replace(/%20/g, ' ')
                .replace(/%2C/g, ',')
                .replace(/%27/g, "'")
                .split(',')
            params.forEach((item) => $(`.selectable-check[value='${item}']`).click())
        }
    })




    const barActive = (calcNumber, calcRange) => {
        if (calcRange.value > (calcNumber === '1' ? 250000 : 500000)) {
            $(`.bar-1.bar-calc-${calcNumber}`).css({
                'border-right': '2px solid white'
            })
        } else {
            $(`.bar-1.bar-calc-${calcNumber}`).css({
                'border-right': '2px solid black'
            })
        }
        if (calcRange.value > (calcNumber === '1' ? 500000 : 750000)) {
            $(`.bar-2.bar-calc-${calcNumber}`).css({
                'border-right': '2px solid white'
            })
        } else {
            $(`.bar-2.bar-calc-${calcNumber}`).css({
                'border-right': '2px solid black'
            })
        }
        if (calcRange.value > (calcNumber === '1' ? 750000 : 1000000)) {
            $(`.bar-3.bar-calc-${calcNumber}`).css({
                'border-right': '2px solid white'
            })
        } else {
            $(`.bar-3.bar-calc-${calcNumber}`).css({
                'border-right': '2px solid black'
            })
        }
    }
    
    function checkBarOverlapWithThumb(calcNumber, rangeElement) {
        const rangeWidth = $(rangeElement).width();
        const thumbPercentage = (rangeElement.value - rangeElement.min) / (rangeElement.max - rangeElement.min);
    
        const thumbPosition = rangeWidth * thumbPercentage;
    
        // Define the bar positions based on window width
        const barPositions = ($(window).width() > 700) 
            ? [
                { start: 0.17 * rangeWidth, end: 0.28 * rangeWidth },
                { start: 0.45 * rangeWidth, end: 0.55 * rangeWidth },
                { start: 0.75 * rangeWidth, end: 0.83 * rangeWidth }
            ]
            : [
                // Define different positions or dimensions for smaller screens, if needed
                // Example:
                { start: 0.10 * rangeWidth, end: 0.30 * rangeWidth },
                { start: 0.40 * rangeWidth, end: 0.61 * rangeWidth },
                { start: 0.70 * rangeWidth, end: 0.93 * rangeWidth }
            ];
    
        barPositions.forEach((bar, index) => {
            const barElement = $(`.bar-${index + 1}.bar-calc-${calcNumber}`);
            if (thumbPosition >= bar.start && thumbPosition <= bar.end) {
                barElement.hide();
            } else {
                barElement.show();
            }
        });
    }
    


    const setValue = (range, tooltip, calcNumber) => {
        const newValue = Number(
                ((range.value - range.min) * 100) / (range.max - range.min)
            ),
            newPosition = 16 - newValue * 0.32,
            tooltipPos = (range.value / (range.max - range.min)) * 99 + '%'
        tooltip.setAttribute(
            'style',
            'left: '
            .concat(tooltipPos, '; transform: translate(-')
            .concat(tooltipPos, ', 5px)')
        )
        document.documentElement.style.setProperty(
            `--range-progress-${calcNumber}`,
            `calc(${newValue}% + (${newPosition}px))`
        )
    }




    if ($('div#calculator-1').length) {
        const range = document.getElementById('range-1'),
            tooltip = document.getElementById('tooltip-1'),
            customersLabel = document.getElementById('customers-1')

        document.addEventListener('DOMContentLoaded', setValue(range, tooltip, 1))


        const setRange = (value) => {
            if (range.value < 250000) {
                $('#range-1').attr('step', 526.315789)
                customers = Math.round(250 + (value / 526.315789) * 10)
            } else if (range.value >= 250000 && range.value < 500000) {
                $('#range-1').attr('step', 555.555556)
                customers = Math.round(5000 + ((value - 250000) / 555.555556) * 100)
            } else if (range.value >= 500000 && range.value < 750000) {
                $('#range-1').attr('step', 5000)
                customers = Math.round(50000 + ((value - 500000) / 5000) * 1000)
            } else {
                $('#range-1').attr('step', 2777.77778)
                customers = Math.round(
                    100000 + ((value - 750000) / 2777.77778) * 10000
                )
            }
        }

        const CheckBoostBox = () => {
            if (customers > 250) {
                $('#boost').prop('checked', true);
                $('#boost-label').text('Included');
                $('.is-proactive').css('display', 'flex');

            } else {
                $('#boost').prop('checked', false);
                $('#boost-label').text('Included in any paid plan');
                $('.is-proactive').hide();
            }
        }



        const Calculate = () => {
            let baseValue = 0
            let userOffset = 250
            let pricePerUser = 0.5

            if (customers > 5000 && customers <= 50000) {
                baseValue = 2375
                userOffset = 5000
                pricePerUser = 0.1
            } else if (customers > 250 && customers <= 5000) {
                baseValue = 0
                userOffset = 250
                pricePerUser = 0.5
            } else if (customers > 50000 && customers <= 100000) {
                baseValue = 6875
                userOffset = 50000
                pricePerUser = 0.05
            } else if (customers > 100000 && customers <= 1000000) {
                baseValue = 9375
                userOffset = 100000
                pricePerUser = 0.01
            } else if (customers <= 250) {
                baseValue = 0
                userOffset = 0
                pricePerUser = 0
            }

            finalPrice = Math.round(
                baseValue + (customers - userOffset) * pricePerUser
            )

            customersLabel.innerHTML = `${numberWithCommas(
            customers
        )} customers / month`
            CheckBoostBox();
        }

        const HandleInput = () => {
            setValue(range, tooltip, 1)
            setRange(range.value)
            Calculate()
            barActive('1', range)
            checkBarOverlapWithThumb('1', range);
            estimatedCost = finalPrice;
            if ($('input[name="proGPT"]').prop('checked')) {
                estimatedCost += 499;
            }
            if ($('input[name="proAnalytics"]').prop('checked')) {
                estimatedCost += 499;
            }
            $('.estimated-cost-title').text(
                '$' + numberWithCommas(estimatedCost).toString()
            )
            tooltip.innerHTML = customers <= 250 ? `<span></span>` : `<span>${
            (estimatedCost/customers).toFixed(2) 
        } per customers</span>`
        }


$(window).resize(function() {
   
    checkBarOverlapWithThumb('1', range); 
});
    
const handleCheckboxChange = function() {
    const checkboxCost = 499;
    let labelSpanId = '';
    let relatedElementClass = '';  // This will store the class of the element we want to show/hide

    if ($(this).prop('name') === "proAnalytics") {
        labelSpanId = '#performance-label';
        relatedElementClass = '.is-proanalytics';  // Related class for "proAnalytics"
    } else if ($(this).prop('name') === "proGPT") {
        labelSpanId = '#gpt-label';
        relatedElementClass = '.is-progpt';  // Related class for "proGPT"
    }

    // Toggle the visibility of the related element
    if ($(this).prop('checked')) {
        $(relatedElementClass).css('display', 'flex');
        estimatedCost += checkboxCost;
        $(labelSpanId).text('Disable add-on');
    } else {
        $(relatedElementClass).hide();
        estimatedCost -= checkboxCost;
        $(labelSpanId).text('Enable add-on');
    }

    $('.estimated-cost-title').text('$' + numberWithCommas(estimatedCost).toString());
    HandleInput();
};


        // Event listeners for both checkboxes
        $('input[name="proAnalytics"], input[name="proGPT"], input[name="proApps"]').on('change', handleCheckboxChange);

        // Initial estimated cost adjustment and label setting
        $('input[name="proGPT"], input[name="proAnalytics"]').each(function() {
            if ($(this).prop('checked')) {
                estimatedCost += 499;
                if ($(this).prop('name') === "proAnalytics") {
                    $('#performance-label').text('Disable add-on');
                    $('is-proanalytics').css('display', 'flex');
                } else if ($(this).prop('name') === "proGPT") {
                    $('#gpt-label').text('Disable add-on');
                    $('is-gpt').css('display', 'flex');

                }
            } else {
                if ($(this).prop('name') === "proAnalytics") {
                    $('#performance-label').text('Enable add-on');
                    $('is-proanalytics').hide()
                } else if ($(this).prop('name') === "proGPT") {
                    $('#gpt-label').text('Enable add-on');
                    $('is-gpt').hide()

                }
            }
        });

        $('.estimated-cost-title').text('$' + numberWithCommas(estimatedCost).toString());

        range.oninput = () => {
            HandleInput()
        }

        const StickToValue = () => {
            if ($(window).width() > 700) {
                if (customers >= 4800 && customers <= 6200) {
                    range.value = 250000
                    HandleInput()
                } else if (customers >= 49100 && customers <= 51200) {
                    range.value = 500000
                    HandleInput()
                }
            } else {
                if (customers >= 4000 && customers <= 6000) {
                    range.value = 250000
                    HandleInput()
                } else if (customers >= 46000 && customers <= 58000) {
                    range.value = 500000
                    HandleInput()
                }
            }
        }

        range.onmouseup = () => {
            StickToValue()
            updateUrlParams('customers', range.value)
        }

        range.ontouchend = () => {
            StickToValue()
            updateUrlParams('customers', range.value)
        }

        range.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                StickToValue();
                updateUrlParams('customers', range.value);
            }
        });


        let searchParams = new URLSearchParams(window.location.search)
        if (searchParams.has('customers')) {
            const customersValue = searchParams.get('customers')
            if (customersValue < 250000) {
                $('#range-1').attr('step', 526.315789)
            } else if (customersValue >= 250000 && customersValue < 500000) {
                $('#range-1').attr('step', 555.555556)
            } else if (customersValue >= 500000 && customersValue < 750000) {
                $('#range-1').attr('step', 5000)
            } else {
                $('#range-1').attr('step', 2777.77778)
            }
            range.value = customersValue
            HandleInput()
        }

    }

})
