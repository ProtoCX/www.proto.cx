function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let estimatedCost = 1000;
let finalPrice1 = 0;
let finalPrice2 = 0;
let finalPrice3 = 0;

$(document).ready(function () {
  const AddSelectedChannels = (group, selectedcontainer) => {
    var selected = $(`.${group}:checked`)
      .map(function () {
        return $(this).attr("name");
      })
      .get()
      .join(", ");
    $(`#${selectedcontainer}`).html(selected);
  };

  const ShowCalcPrice = () => {
    if ($(window).width() > 991) {
      if ($(".calculator:visible").length <= 1) {
        $(".price-container").css({ display: "none" });
      } else {
        $(".price-container").css({ display: "block" });
      }
    } else return;
  };

  const labelPosition = () => {
    if ($("div#calculator-1").width() < 340) {
      $(".label1").css({ transform: "translate(-100%,0px)" });
      $(".label2").css({ transform: "translate(-100%,0px)" });
    } else {
      $(".label1").css({ transform: "translate(-50%,0px)" });
      $(".label2").css({ transform: "translate(-50%,0px)" });
    }
  };

  labelPosition();

  $(".tooltip-question").on("click", function (e) {
    if ($(window).width() < 992) {
      $(this).next(".tooltip-text").fadeToggle("slow", "linear");
    } else return;
  });

  const GroupHandle = (groupNumber) => {
    if (
      $(`.group-${groupNumber}`).filter(":checked").length < 1 &&
      $(".custom-check:checked").length < 1
    ) {
      return;
    } else if ($(`.group-${groupNumber}`).filter(":checked").length < 1) {
      $(`#range-${groupNumber}`).val(0).trigger("input");
      $(`#calculator-${groupNumber}`).hide();
      $(".estimated-cost-title").text(
        "$" + numberWithCommas(estimatedCost).toString()
      );
      ShowCalcPrice();
    } else {
      AddSelectedChannels(
        `group-${groupNumber}`,
        `selected-checkmarks-${groupNumber}`
      );
      $(`#calculator-${groupNumber}`).css("display", "flex");
      $(".estimated-cost-title").text(
        "$" + numberWithCommas(estimatedCost).toString()
      );
      ShowCalcPrice();
    }
    setTimeout(labelPosition(), 400);
  };

  $(".group-1").on("click", function () {
    GroupHandle("1");
  });

  $(".group-2").click(function () {
    GroupHandle("2");
  });

  $(".group-3").click(function () {
    GroupHandle("3");
  });

  $(".custom-check").on("click", function (e) {
    if ($(".custom-check:checked").length == 0 && !this.checked) {
      this.checked = true;
      return false;
    } else {
      $(this).closest("label").toggleClass("active");
      return true;
    }
  });

  function updateUrlParams(key, value) {
    if ("URLSearchParams" in window) {
      var searchParams = new URLSearchParams(window.location.search);
      searchParams.set(key, value);
      var newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    }
  }

  $(".pricing-list").ready(function () {
    const checkboxes = document.getElementsByClassName("custom-check");
    var checkboxArray = Array.from(checkboxes);
    checkboxArray.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        var selectedValues = [];
        checkboxArray.forEach(function (checkbox) {
          if (checkbox.checked) {
            selectedValues.push(checkbox.value);
          }
        });
        var queryString = selectedValues.join(",");
        updateUrlParams("channels", queryString);
      });
    });
  });

  $(".pricing-list").ready(function () {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("channels")) {
      let params = searchParams
        .get("channels")
        .replace(/%20/g, " ")
        .replace(/%2C/g, ",")
        .replace(/%27/g, "'")
        .split(",");
      params.forEach((item) => $(`.custom-check[value='${item}']`).click());
    }
  });

  const barActive = (calcNumber, calcRange) => {
    if (calcRange.value > (calcNumber === "1" ? 33333.3333 : 333333.333)) {
      $(`.bar-1.bar-calc-${calcNumber}`).css({
        "border-right": "2px solid white",
      });
    } else {
      $(`.bar-1.bar-calc-${calcNumber}`).css({
        "border-right": "2px solid black",
      });
    }
    if (calcRange.value > (calcNumber === "1" ? 69533 : 686666)) {
      $(`.bar-2.bar-calc-${calcNumber}`).css({
        "border-right": "2px solid white",
      });
    } else {
      $(`.bar-2.bar-calc-${calcNumber}`).css({
        "border-right": "2px solid black",
      });
    }
  };

  const setValue = (range, tooltip, calcNumber) => {
    const newValue = Number(
        ((range.value - range.min) * 100) / (range.max - range.min)
      ),
      newPosition = 16 - newValue * 0.32,
      tooltipPos = (range.value / (range.max - range.min)) * 99 + "%";
    tooltip.setAttribute(
      "style",
      "left: "
        .concat(tooltipPos, "; transform: translate(-")
        .concat(tooltipPos, ", 5px)")
    );
    document.documentElement.style.setProperty(
      `--range-progress-${calcNumber}`,
      `calc(${newValue}% + (${newPosition}px))`
    );
  };

  if ($("div#calculator-1").length) {
    const range = document.getElementById("range-1"),
      tooltip = document.getElementById("tooltip-1"),
      price = document.getElementById("price-1");

    document.addEventListener("DOMContentLoaded", setValue(range, tooltip, 1));

    let customers = 0;

    const setRange = (value) => {
      if (range.value < 33333.33328) {
        $("#range-1").attr("step", 833.333332);
        customers = Math.round(1000 + (value / 833.333332) * 100);
      } else if (range.value >= 33333.33328 && range.value < 66666.6666) {
        $("#range-1").attr("step", 74.074074);
        customers = Math.round(
          5000 + ((value - 33333.33328) / 74.074074) * 100
        );
      } else {
        $("#range-1").attr("step", 66.6666666);
        customers = Math.round(
          50000 + ((value - 66666.6666) / 66.666666) * 100
        );
      }
    };

    const Calculate = () => {
      let baseValue = 0;
      let userOffset = 1000;
      let pricePerUser = 0.5;

      if (customers > 5000 && customers <= 50000) {
        baseValue = 2000;
        userOffset = 5000;
        pricePerUser = 0.1;
      } else if (customers > 1000 && customers <= 5000) {
        baseValue = 0;
        userOffset = 1000;
        pricePerUser = 0.5;
      } else if (customers > 50000 && customers <= 100000) {
        baseValue = 6500;
        userOffset = 50000;
        pricePerUser = 0.05;
      } else if (customers <= 1000) {
        baseValue = 0;
        userOffset = 0;
        pricePerUser = 0;
      }

      finalPrice1 = Math.round(
        baseValue + (customers - userOffset) * pricePerUser
      );

      tooltip.innerHTML = `<span>${numberWithCommas(
        customers
      )} Customers</span>`;
      price.innerHTML = `+ $${numberWithCommas(
        finalPrice1
      )}<span> / month</span>`;
    };

    const HandleInput = () => {
      setValue(range, tooltip, 1);
      setRange(range.value);
      Calculate();
      barActive("1", range);
      estimatedCost = 1000 + finalPrice1 + finalPrice2 + finalPrice3;
      $(".estimated-cost-title").text(
        "$" + numberWithCommas(estimatedCost).toString()
      );
    };

    range.oninput = () => {
      HandleInput();
    };

    const StickToValue = () => {
      if ($(window).width() > 700) {
        if (customers >= 4800 && customers <= 6200) {
          range.value = 33333.33328;
          HandleInput();
        } else if (customers >= 49100 && customers <= 51200) {
          range.value = 66666.6666;
          HandleInput();
        }
      } else {
        if (customers >= 4000 && customers <= 10000) {
          range.value = 33333.33328;
          HandleInput();
        } else if (customers >= 46000 && customers <= 58000) {
          range.value = 66666.6666;
          HandleInput();
        }
      }
    };

    range.onmouseup = () => {
      StickToValue();
      updateUrlParams("customers", range.value);
    };

    range.ontouchend = () => {
      StickToValue();
      updateUrlParams("customers", range.value);
    };

    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("customers")) {
      const customersValue = searchParams.get("customers");
      if (customersValue < 33333.33328) {
        $("#range-1").attr("step", 833.333332);
      } else if (customersValue >= 33333.33328 && customersValue < 66666.6666) {
        $("#range-1").attr("step", 74.074074);
      } else {
        $("#range-1").attr("step", 66.6666666);
      }
      range.value = customersValue;
      HandleInput();
    }
  }

  const stickToValueMessages = (messages, range) => {
    const isWideScreen = $(window).width() > 700;
    const isInRange = (min, max) => messages >= min && messages <= max;

    if (isWideScreen) {
      if (isInRange(49000, 56000)) {
        range.value = 330000;
      } else if (isInRange(491000, 530000)) {
        range.value = 660000;
      }
    } else {
      if (isInRange(45000, 79000)) {
        range.value = 330000;
      } else if (isInRange(485000, 570000)) {
        range.value = 660000;
      }
    }
  };

  const setMessagesFromParams = (calcNumber) => {
    const calcDiv = $(`div#calculator-${calcNumber}`);

    if (!calcDiv.is(":visible")) {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const messagesParam = `messages${calcNumber - 1}`;

    if (!searchParams.has(messagesParam)) {
      return;
    }
    const messagesValue = searchParams.get(messagesParam);
    const range = calcDiv.find("input[type=range]");

    if (messagesValue < 330000) {
      range.attr("step", 8250);
    } else if (messagesValue >= 330000 && messagesValue < 660000) {
      range.attr("step", 733.333333);
    } else {
      range.attr("step", 6600);
    }

    range.val(messagesValue);
  };

  if ($("div#calculator-2").length) {
    const range = document.getElementById("range-2"),
      tooltip = document.getElementById("tooltip-2"),
      price = document.getElementById("price-2");

    document.addEventListener("DOMContentLoaded", setValue(range, tooltip, 2));

    let messages = 0;

    const setRange = (value) => {
      if (range.value < 330000) {
        $("#range-2").attr("step", 8250);
        messages = Math.round(10000 + (value / 8250) * 1000);
      } else if (range.value >= 330000 && range.value < 660000) {
        $("#range-2").attr("step", 733.333333);
        messages = Math.round(50000 + ((value - 330000) / 733.333333) * 1000);
      } else {
        $("#range-2").attr("step", 6600);
        messages = Math.round(500000 + ((value - 660000) / 6600) * 10000);
      }
    };

    const Calculate = () => {
      let baseValue = 0;
      let userOffset = 10000;
      let pricePerUser = 0.05;

      if (messages > 50000 && messages <= 500000) {
        baseValue = 2000;
        userOffset = 50000;
        pricePerUser = 0.01;
      } else if (messages > 10000 && messages <= 50000) {
        baseValue = 0;
        userOffset = 10000;
        pricePerUser = 0.05;
      } else if (messages > 500000 && messages <= 1000000) {
        baseValue = 6500;
        userOffset = 500000;
        pricePerUser = 0.005;
      } else if (messages <= 10000) {
        baseValue = 0;
        userOffset = 0;
        pricePerUser = 0;
      }

      finalPrice2 = Math.round(
        baseValue + (messages - userOffset) * pricePerUser
      );

      tooltip.innerHTML = `<span>${numberWithCommas(messages)} Messages</span>`;
      price.innerHTML = `+ $${numberWithCommas(
        finalPrice2
      )}<span> / month</span>`;
    };

    const HandleInput = () => {
      setValue(range, tooltip, 2);
      setRange(range.value);
      Calculate();
      barActive("2", range);
      estimatedCost = 1000 + finalPrice1 + finalPrice2 + finalPrice3;
      $(".estimated-cost-title").text(
        "$" + numberWithCommas(estimatedCost).toString()
      );
    };

    range.oninput = () => {
      HandleInput();
    };

    range.ontouchend = () => {
      stickToValueMessages(messages, range);
      HandleInput();
      updateUrlParams("messages1", range.value);
    };

    range.onmouseup = () => {
      stickToValueMessages(messages, range);
      HandleInput();
      updateUrlParams("messages1", range.value);
    };

    $(".business-pricing-section").ready(function () {
      setMessagesFromParams(2);
      HandleInput();
    });
  }

  if ($("div#calculator-3").length) {
    const range = document.getElementById("range-3"),
      tooltip = document.getElementById("tooltip-3"),
      price = document.getElementById("price-3");

    document.addEventListener("DOMContentLoaded", setValue(range, tooltip, 3));

    let messages = 0;

    const setRange = (value) => {
      if (range.value < 330000) {
        $("#range-3").attr("step", 8250);
        messages = Math.round(10000 + (value / 8250) * 1000);
      } else if (range.value >= 330000 && range.value < 660000) {
        $("#range-3").attr("step", 733.333333);
        messages = Math.round(50000 + ((value - 330000) / 733.333333) * 1000);
      } else {
        $("#range-3").attr("step", 6600);
        messages = Math.round(500000 + ((value - 660000) / 6600) * 10000);
      }
    };

    const Calculate = () => {
      let baseValue = 0;
      let userOffset = 10000;
      let pricePerUser = 0.04;

      if (messages > 50000 && messages <= 500000) {
        baseValue = 1600;
        userOffset = 50000;
        pricePerUser = 0.008;
      } else if (messages > 10000 && messages <= 50000) {
        baseValue = 0;
        userOffset = 10000;
        pricePerUser = 0.04;
      } else if (messages > 500000 && messages <= 1000000) {
        baseValue = 5200;
        userOffset = 500000;
        pricePerUser = 0.004;
      } else if (messages <= 10000) {
        baseValue = 0;
        userOffset = 0;
        pricePerUser = 0;
      }

      finalPrice3 = Math.round(
        baseValue + (messages - userOffset) * pricePerUser
      );

      tooltip.innerHTML = `<span>${numberWithCommas(messages)} Messages</span>`;
      price.innerHTML = `+ $${numberWithCommas(
        finalPrice3
      )}<span> / month</span>`;
    };

    const HandleInput = () => {
      setValue(range, tooltip, 3);
      setRange(range.value);
      Calculate();
      barActive("3", range);
      estimatedCost = 1000 + finalPrice1 + finalPrice2 + finalPrice3;
      $(".estimated-cost-title").text(
        "$" + numberWithCommas(estimatedCost).toString()
      );
    };

    range.oninput = () => {
      HandleInput();
    };

    range.ontouchend = () => {
      stickToValueMessages(messages, range);
      HandleInput();
      updateUrlParams("messages2", range.value);
    };

    range.onmouseup = () => {
      stickToValueMessages(messages, range);
      HandleInput();
      updateUrlParams("messages2", range.value);
    };

    $(".business-pricing-section").ready(function () {
      setMessagesFromParams(3);
      HandleInput();
    });
  }
});
