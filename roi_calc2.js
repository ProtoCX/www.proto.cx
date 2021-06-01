! function (a) {
  "use strict";
  var b = {},
    c = {},
    d = new RegExp(/^(minChecked|maxChecked|minSelected|maxSelected|minLength|maxLength|equalTo|different|regExp|remote|callback)\[(\w{1,15})\]/i),
    e = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/),
    f = new RegExp(/^[\-\+]?(\d+|\d+\.?\d+)$/),
    g = {
      required: "This field is required. Please be sure to check.",
      email: "Your E-mail address appears to be invalid. Please be sure to check.",
      number: "You can enter only numbers in this field.",
      maxLength: "Maximum {count} characters allowed!",
      minLength: "Minimum {count} characters allowed!",
      maxChecked: "Maximum {count} options allowed. Please be sure to check.",
      minChecked: "Please select minimum {count} options.",
      maxSelected: "Maximum {count} selection allowed. Please be sure to check.",
      minSelected: "Minimum {count} selection allowed. Please be sure to check.",
      notEqual: "Fields do not match. Please be sure to check.",
      different: "Fields cannot be the same as each other",
      creditCard: "Invalid credit card number. Please be sure to check."
    },
    h = {
      showErrorMessages: !0,
      display: "bubble",
      errorTemplateClass: "validetta-bubble",
      errorClass: "validetta-error",
      validClass: "validetta-valid",
      bubblePosition: "right",
      bubbleGapLeft: 15,
      bubbleGapTop: 0,
      realTime: !1,
      onValid: function () {},
      onError: function () {},
      validators: {}
    },
    i = function (a) {
      return "string" == typeof a ? a.replace(/^\s+|\s+$/g, "") : a
    },
    j = {
      required: function (a, b) {
        switch (a.el.type) {
          case "checkbox":
            return a.el.checked || g.required;
          case "radio":
            return this.radio.call(b, a.el) || g.required;
          case "select-multiple":
            return null !== a.val || g.required;
          default:
            return "" !== a.val || g.required
        }
      },
      email: function (a) {
        return e.test(a.val) || g.email
      },
      number: function (a) {
        return f.test(a.val) || g.number
      },
      minLength: function (a) {
        var b = a.val.length;
        return 0 === b || b >= a.arg || g.minLength.replace("{count}", a.arg)
      },
      maxLength: function (a) {
        return a.val.length <= a.arg || g.maxLength.replace("{count}", a.arg)
      },
      equalTo: function (a, b) {
        return b.form.querySelector('input[name="' + a.arg + '"]').value === a.val || g.notEqual
      },
      different: function (a, b) {
        return b.form.querySelector('input[name="' + a.arg + '"]').value !== a.val || g.different
      },
      creditCard: function (a) {
        if ("" === a.val) return !0;
        var b, c, d, e, f, h, i, j = 0;
        if (b = new RegExp(/[^0-9]+/g), c = a.val.replace(b, ""), i = c.length, 16 > i) return g.creditCard;
        for (f = 0; i > f; f++) d = i - f, e = parseInt(c.substring(d - 1, d), 10), f % 2 === 1 ? (h = 2 * e, h > 9 && (h = 1 + (h - 10))) : h = e, j += h;
        return j > 0 && j % 10 === 0 ? !0 : g.creditCard
      },
      maxChecked: function (b, c) {
        var d = a(c.form.querySelectorAll('input[type=checkbox][name="' + b.el.name + '"]'));
        if (0 === d.index(b.el)) {
          var e = d.filter(":checked").length;
          if (0 !== e) return e <= b.arg || g.maxChecked.replace("{count}", b.arg)
        }
      },
      minChecked: function (b, c) {
        var d = a(c.form.querySelectorAll('input[type=checkbox][name="' + b.el.name + '"]'));
        if (0 === d.index(b.el)) {
          var e = d.filter(":checked").length;
          return e >= b.arg || g.minChecked.replace("{count}", b.arg)
        }
      },
      maxSelected: function (a) {
        return null !== a.val ? a.val.length <= a.arg || g.maxSelected.replace("{count}", a.arg) : void 0
      },
      minSelected: function (a) {
        return null !== a.val && a.val.length >= a.arg || g.minSelected.replace("{count}", a.arg)
      },
      radio: function (a) {
        var b = this.form.querySelectorAll('input[type=radio][name="' + a.name + '"]:checked').length;
        return 1 === b
      },
      regExp: function (a, b) {
        var c = b.options.validators.regExp[a.arg],
          d = new RegExp(c.pattern);
        return d.test(a.val) || c.errorMessage
      },
      remote: function (a) {
        a.remote = a.arg
      },
      callback: function (a, b) {
        var c = b.options.validators.callback[a.arg];
        return c.callback(a.el, a.val) || c.errorMessage
      }
    };
  b = function (b, c) {
    this.handler = !1, this.options = a.extend(!0, {}, h, c), this.form = b, this.xhr = {}, this.events()
  }, b.prototype = {
    constructor: b,
    events: function () {
      var b = this;
      a(this.form).submit(function (a) {
        return c = this.querySelectorAll("[data-validetta]"), b.init(a)
      }), this.options.realTime === !0 && (a(this.form).find("[data-validetta]").not("[type=checkbox]").on("change", function (d) {
        return c = a(this), b.init(d)
      }), a(this.form).find("[data-validetta][type=checkbox]").on("click", function (a) {
        return c = b.form.querySelectorAll('[data-validetta][type=checkbox][name="' + this.name + '"]'), b.init(a)
      })), a(this.form).on("reset", function () {
        return a(b.form.querySelectorAll("." + b.options.errorClass + ", ." + b.options.validClass)).removeClass(b.options.errorClass + " " + b.options.validClass), b.reset()
      })
    },
    init: function (a) {
      return this.reset(c), this.checkFields(a), "submit" !== a.type ? void 0 : "pending" === this.handler ? !1 : this.handler === !0 ? (this.options.onError.call(this, a), !1) : this.options.onValid.call(this, a)
    },
    checkFields: function (b) {
      var e = this,
        f = [];
      this.getInvalidFields = function () {
        return f
      };
      for (var g = 0, h = c.length; h > g; g++)
        if (!c[g].disabled) {
          var k, l = c[g],
            m = "",
            n = i(a(l).val()),
            o = l.getAttribute("data-validetta").split(",");
          this.tmp = {}, this.tmp = {
            el: l,
            val: n,
            parent: this.parents(l)
          };
          for (var p = 0, q = o.length; q > p; p++) {
            var r, s = o[p].match(d);
            if (null !== s ? ("undefined" != typeof s[2] && (this.tmp.arg = s[2]), r = s[1]) : r = o[p], ("" !== n || "required" === r || "equalTo" === r) && j.hasOwnProperty(r) && (k = j[r](e.tmp, e), "undefined" != typeof k && k !== !0)) {
              var t = l.getAttribute("data-vd-message-" + r);
              null !== t && (k = t), m += k + "<br/>"
            }
          }
          "" !== m ? (f.push({
            field: l,
            errors: m
          }), this.addErrorClass(this.tmp.parent), this.window.open.call(this, l, m)) : "undefined" != typeof this.tmp.remote ? this.checkRemote(l, b) : ("undefined" != typeof k ? this.addValidClass(this.tmp.parent) : a(this.tmp.parent).removeClass(this.options.errorClass + " " + this.options.validClass), k = void 0)
        }
    },
    checkRemote: function (b, c) {
      var d = {},
        e = {},
        f = b.name || b.id;
      "undefined" == typeof this.remoteCache && (this.remoteCache = {}), e[f] = this.tmp.val, d = a.extend(!0, {}, {
        data: e
      }, this.options.validators.remote[this.tmp.remote] || {});
      var g = a.param(d),
        h = this.remoteCache[g];
      if ("undefined" != typeof h) switch (h.state) {
        case "pending":
          this.handler = "pending", h.event = c.type;
          break;
        case "rejected":
          throw c.preventDefault(), new Error(h.result.message);
        case "resolved":
          h.result.valid === !1 ? (this.addErrorClass(this.tmp.parent), this.window.open.call(this, b, h.result.message)) : this.addValidClass(this.tmp.parent)
      } else {
        var i = this.xhr[f];
        "undefined" != typeof i && "pending" === i.state() && i.abort(), h = this.remoteCache[g] = {
          state: "pending",
          event: c.type
        }, this.remoteRequest(d, h, b, f)
      }
    },
    remoteRequest: function (b, c, d, e, f) {
      var g = this;
      a(this.tmp.parent).addClass("validetta-pending"), this.xhr[e] = a.ajax(b).done(function (b) {
        "object" != typeof b && (b = JSON.parse(b)), c.state = "resolved", c.result = b, "submit" === c.event ? (g.handler = !1, a(g.form).trigger("submit")) : b.valid === !1 ? (g.addErrorClass(g.tmp.parent), g.window.open.call(g, d, b.message)) : g.addValidClass(g.tmp.parent)
      }).fail(function (a, b) {
        if ("abort" !== b) {
          var d = "Ajax request failed for field (" + e + ") : " + a.status + " " + a.statusText;
          throw c.state = "rejected", c.result = {
            valid: !1,
            message: d
          }, new Error(d)
        }
      }).always(function (b) {
        a(g.tmp.parent).removeClass("validetta-pending")
      }), this.handler = "pending"
    },
    window: {
      open: function (b, c) {
        if (!this.options.showErrorMessages) return void(this.handler = !0);
        var d = this.parents(b);
        if ("undefined" == typeof d && (d = b[0].parentNode), !d.querySelectorAll("." + this.options.errorTemplateClass).length) {
          var e = document.createElement("span");
          if (e.className = this.options.errorTemplateClass + " " + this.options.errorTemplateClass + "--" + this.options.bubblePosition, "bubble" === this.options.display) {
            var f, g = 0,
              h = 0;
            f = a(b).position(), "bottom" === this.options.bubblePosition ? h = b.offsetHeight : g = b.offsetWidth, e.innerHTML = "", e.style.top = f.top + h + this.options.bubbleGapTop + "px", e.style.left = f.left + g + this.options.bubbleGapLeft + "px"
          }
          d.appendChild(e), e.innerHTML = c, this.handler = !0
        }
      },
      close: function (a) {
        a.parentNode.removeChild(a)
      }
    },
    reset: function (a) {
      var b = {};
      b = "undefined" == typeof a || a.length > 1 && "checkbox" !== a[0].type ? this.form.querySelectorAll("." + this.options.errorTemplateClass) : this.parents(a[0]).querySelectorAll("." + this.options.errorTemplateClass);
      for (var c = 0, d = b.length; d > c; c++) this.window.close.call(this, b[c]);
      this.handler = !1
    },
    addErrorClass: function (b) {
      a(b).removeClass(this.options.validClass).addClass(this.options.errorClass)
    },
    addValidClass: function (b) {
      a(b).removeClass(this.options.errorClass).addClass(this.options.validClass)
    },
    parents: function (a) {
      for (var b = parseInt(a.getAttribute("data-vd-parent-up"), 10) || 0, c = 0; b >= c; c++) a = a.parentNode;
      return a
    }
  }, a.fn.validetta = function (c, d) {
    return a.validettaLanguage && (g = a.extend(!0, {}, g, a.validettaLanguage.messages)), "undefined" != typeof d && (g = a.extend(!0, {}, g, d)), this.each(function () {
      new b(this, c)
    })
  }
}(jQuery);

/*!
 * End Validetta
 */

function animateNumber(selector, targetValue) {
  var counterStart = parseFloat($(selector).text().replace(/,/g, ''));

  $(selector).prop('Counter', counterStart).animate({
    Counter: targetValue
  }, {
    duration: 1000,
    easing: 'swing',
    step: function (now) {
      $(selector).text(Math.ceil(now).toLocaleString('en'));
    }
  });
}

function formatStorageString(dataSelector, data) {
  var string = '';

  for (var key in data) {
    var id = $('[' + dataSelector + '="' + key + '"]').attr('id');

    string += $('label[for="' + id + '"]').text();
    string += ': ';
    string += data[key];
    string += ', \r\n';
  }

  return string;
}

// Pricing ROI
(function () {
  var data = {
    amch: 2500,
    acpch: 1,
    achw: 0.5,

    amc: 1000,
    amcpc: 1,
    acw: 2,

    ame: 3000,
    amcpe: 5,
    aew: 240,

    acpm: 10000,
  };

  $('[data-roi-input]').on('input', updateData).each(function () {
    this.value = data[this.dataset.roiInput];
  });

  function contactsDeflected() {
    return ((data.amch + data.amc + data.ame) * 0.75);
  }

  function customerWaitTimeReduction() {
    return (((data.amch * data.achw) + (data.amc * data.acw) + (data.ame * data.aew)) * 0.75);
  }

  function contactsCenterSavings() {
    return (((data.amch * data.acpch) + (data.amc * data.amcpc) + (data.ame * data.amcpe)) * 0.75);
  }

  function annualRoi() {
    let totalSavings = 9 * ((data.amch * data.acpch) + (data.amc * data.amcpc) + (data.ame * data.amcpe))

    // Proto Pricing
    let discountRate = (data.acpm <= 5000) ? 1 : (1 - (Math.ceil(data.acpm/10000) * 0.025 ))
		let baseValue = (data.acpm > 5000) ? 3000 : 1000
		let userOffset = (data.acpm > 5000) ? 5000 : 1000
		let pricePerUser = (data.acpm > 5000) ? 0.1 : 0.5
		let protoPricingPerMonth = Math.round((baseValue + (data.acpm - userOffset) * pricePerUser) * discountRate)
    var protoPricing = protoPricingPerMonth * 12

    var roi = ((totalSavings - protoPricing) - protoPricing) / (protoPricing/100)
    if (roi < 0) {
      return '-';
    }
    return roi;
  }

  function updateData() {
    var key = this.dataset.roiInput;
    data[key] = parseFloat(this.value, 10);
  }

  function calculate() {
    contactsDeflected() < 0 || isNaN(contactsDeflected()) ? animateNumber('[data-contacts-deflected]', 0) : animateNumber('[data-contacts-deflected]', contactsDeflected());
    contactsCenterSavings() < 0 || isNaN(contactsCenterSavings()) ? animateNumber('[data-contact-center-savings]', 0) : animateNumber('[data-contact-center-savings]', contactsCenterSavings());
    customerWaitTimeReduction() < 0 || isNaN(customerWaitTimeReduction()) ? animateNumber('[data-customer-wait-time-reduction]', 0) : animateNumber('[data-customer-wait-time-reduction]', customerWaitTimeReduction());
    annualRoi() < 0 || isNaN(annualRoi()) ? animateNumber('[data-abandoned-chats]', 0) : animateNumber('[data-abandoned-chats]', annualRoi());

  }

  calculate();

  function formatStorageString() {
    var string = '';

    for (var key in data) {
      var id = $('[data-roi-input="' + key + '"]').attr('id');

      string += $('label[for="' + id + '"]').text();
      string += ': ';
      string += data[key];
      string += ', \r\n';
    }

    return string;
  }

  $('#roi-calculator').validetta({
    realTime: true,
    display: 'inline',
    errorTemplateClass: 'validetta-inline',
    onValid: function (event) {
      // Prevent the submission of the form
      event.preventDefault();
      calculate();
      sessionStorage.setItem('roi', formatStorageString('data-roi-input', data));
    },
    onError: function (event) {
      alert('Please ensure all fields are filled in correctly.');
    },
  }, {
    required: 'This field is required.'
  });
})();

// Gaming ROI
(function () {
  var data = {
    amns: 10000,
    cpa: 200,
    cr: 35,
    npar: 45,
    apar: 25,
    clv: 500,
    acl: 3,
    amap: 8000,
    ccsc: 50000,
    achatsm: 50000,
    cpchat: 1,
    acallsm: 25000,
    cpcall: 2,
    aemailsm: 12500,
    cpemail: 4
  };
  var percentKeys = ['cr', 'npar', 'apar'];

  function projectedNetRevenueIncrease() {
    var impactOnConversion = 0.01;
    var impactOnAttrition = 0.02;
    var conversionRate = (data.cr / 100);
    var N = data.amns * conversionRate;
    var A = data.amap;
    var x = 1 - (data.npar / 100);
    var y = 1 - (data.apar / 100);
    var NS = data.amns * (conversionRate + impactOnConversion);
    var xi = x + impactOnAttrition; // Changed - to +; before it was (1 - 0.45 - 0.02)
    var yi = y + impactOnAttrition; // Changed - to +; before it was (1 - 0.25 - 0.02)
    var CPA = data.cpa;
    var CLV = data.clv;
    var ALV = data.acl;
    var Nx = N * x;
    var Ay = A * y;
    var NSxi = NS * xi;
    var Ayi = A * yi;
    var pow = Math.pow;

    // Prospect Current Situation
    var projectedNetRevenue =
      (
        ((N + A) * (CLV / ALV)) +
        ((N + Nx + Ay) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (A * pow(y, 2))) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (A * pow(y, 3))) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (Nx * pow(y, 3)) + (A * pow(y, 4))) * (CLV / ALV))

        +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (Nx * pow(y, 3)) + (Nx * pow(y, 4)) + (A * pow(y, 5))) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (Nx * pow(y, 3)) + (Nx * pow(y, 4)) + (Nx * pow(y, 5)) + (A * pow(y, 6))) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (Nx * pow(y, 3)) + (Nx * pow(y, 4)) + (Nx * pow(y, 5)) + (Nx * pow(y, 6)) + (A * pow(y, 7))) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (Nx * pow(y, 3)) + (Nx * pow(y, 4)) + (Nx * pow(y, 5)) + (Nx * pow(y, 6)) + (Nx * pow(y, 7)) + (A * pow(y, 8))) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (Nx * pow(y, 3)) + (Nx * pow(y, 4)) + (Nx * pow(y, 5)) + (Nx * pow(y, 6)) + (Nx * pow(y, 7)) + (Nx * pow(y, 8)) + (A * pow(y, 9))) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (Nx * pow(y, 3)) + (Nx * pow(y, 4)) + (Nx * pow(y, 5)) + (Nx * pow(y, 6)) + (Nx * pow(y, 7)) + (Nx * pow(y, 8)) + (Nx * pow(y, 9)) + (A * pow(y, 10))) * (CLV / ALV)) +
        ((N + Nx + (Nx * y) + (Nx * pow(y, 2)) + (Nx * pow(y, 3)) + (Nx * pow(y, 4)) + (Nx * pow(y, 5)) + (Nx * pow(y, 6)) + (Nx * pow(y, 7)) + (Nx * pow(y, 8)) + (Nx * pow(y, 9)) + (Nx * pow(y, 10)) + (A * pow(y, 11))) * (CLV / ALV)) -
        ((N) * (CPA) * 12)
      );

    // NEW PLAYER ATTRTITION with Sinitic Improvement
    var projectedNetRevenueUsingSinitic =
      (
        ((NS + A) * (CLV / ALV)) +
        ((NS + NSxi + Ayi) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (A * pow(yi, 2))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (A * pow(yi, 3))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (NSxi * pow(y, 3)) + (A * pow(yi, 4))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (NSxi * pow(y, 3)) + (NSxi * pow(y, 4)) + (A * pow(yi, 5))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (NSxi * pow(y, 3)) + (NSxi * pow(y, 4)) + (NSxi * pow(y, 5)) + (A * pow(yi, 6))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (NSxi * pow(y, 3)) + (NSxi * pow(y, 4)) + (NSxi * pow(y, 5)) + (NSxi * pow(y, 6)) + (A * pow(yi, 7))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (NSxi * pow(y, 3)) + (NSxi * pow(y, 4)) + (NSxi * pow(y, 5)) + (NSxi * pow(y, 6)) + (NSxi * pow(y, 7)) + (A * pow(yi, 8))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (NSxi * pow(y, 3)) + (NSxi * pow(y, 4)) + (NSxi * pow(y, 5)) + (NSxi * pow(y, 6)) + (NSxi * pow(y, 7)) + (NSxi * pow(y, 8)) + (A * pow(yi, 9))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (NSxi * pow(y, 3)) + (NSxi * pow(y, 4)) + (NSxi * pow(y, 5)) + (NSxi * pow(y, 6)) + (NSxi * pow(y, 7)) + (NSxi * pow(y, 8)) + (NSxi * pow(y, 9)) + (A * pow(yi, 10))) * (CLV / ALV)) +
        ((NS + NSxi + (NSxi * y) + (NSxi * pow(y, 2)) + (NSxi * pow(y, 3)) + (NSxi * pow(y, 4)) + (NSxi * pow(y, 5)) + (NSxi * pow(y, 6)) + (NSxi * pow(y, 7)) + (NSxi * pow(y, 8)) + (NSxi * pow(y, 9)) + (NSxi * pow(y, 10)) + (A * pow(yi, 11))) * (CLV / ALV)) -
        ((N) * (CPA) * 12)
      )

    return projectedNetRevenueUsingSinitic - projectedNetRevenue;
  }

  function annualCallCenterSavings() {
    var lfd = data.ccsc - 50000;
    var deflectRate = 0.75;
    return 12 * (
      ((data.cpchat * data.achatsm) * deflectRate) +
      ((data.cpemail * data.aemailsm) * deflectRate) +
      ((data.cpcall * data.acallsm) * deflectRate)
    ) + lfd;
  }

  function totalBottomLineImprovement() {
    return (projectedNetRevenueIncrease() + annualCallCenterSavings());
  }

  function annualROI() {
    return (totalBottomLineImprovement() / 50000);
  }

  function updateData() {
    var key = this.dataset.roiGamingInput;

    data[key] = parseInt(this.value, 10);
  }

  function animateNumber(selector, targetValue) {
    var counterStart = parseFloat($(selector).text().replace(/,/g, ''));

    $(selector).prop('Counter', counterStart).animate({
      Counter: targetValue
    }, {
      duration: 1000,
      easing: 'swing',
      step: function (now) {
        $(selector).text(Math.ceil(now).toLocaleString('en'));
      }
    });
  }

  function calculate() {
    projectedNetRevenueIncrease() < 0 || isNaN(projectedNetRevenueIncrease()) ? animateNumber('[data-net-revenue-increase]', 0) : animateNumber('[data-net-revenue-increase]', projectedNetRevenueIncrease());
    annualCallCenterSavings() < 0 || isNaN(annualCallCenterSavings()) ? animateNumber('[data-annual-call-center-savings]', 0) : animateNumber('[data-annual-call-center-savings]', annualCallCenterSavings());
    totalBottomLineImprovement() < 0 || isNaN(totalBottomLineImprovement()) ? animateNumber('[data-total-bottom-line-improvement]', 0) : animateNumber('[data-total-bottom-line-improvement]', totalBottomLineImprovement());
    annualROI() < 0 || isNaN(annualROI()) ? animateNumber('[data-annual-roi]', 0) : animateNumber('[data-annual-roi]', annualROI());
  }

  $('[data-roi-gaming-input]').on('input', updateData).each(function () {
    this.value = data[this.dataset.roiGamingInput];
  });


  function formatStorageString() {
    var string = '';

    for (var key in data) {
      var id = $('[data-roi-gaming-input="' + key + '"]').attr('id');

      string += $('label[for="' + id + '"]').text();
      string += ': ';
      string += data[key];
      string += ', \r\n';
    }

    return string;
  }


  $('#roi-gaming-calculator').validetta({
    realTime: true,
    display: 'inline',
    errorTemplateClass: 'validetta-inline',
    onValid: function (event) {
      // Prevent the submission of the form
      event.preventDefault();
      calculate();
      sessionStorage.setItem('roi_gaming', formatStorageString('data-roi-gaming-input', data));
    },
    onError: function (event) {
      alert('Please ensure all fields are filled in correctly.');
    },
  }, {
    required: 'This field is required.'
  });

  calculate();
})();
