const Funding = Backbone.Model.extend({
  defaults: {
    total: {
      2014: 4426005,
      2015: 4857359,
      2016: 4637815,
    },
    individuals: {
      2014: 3655474,
      2015: 4080182,
      2016: 3869976,
    },
    foundations: {
      2014: 748712,
      2015: 761250,
      2016: 612728,
    },
    other: {
      2014: 21819,
      2015: 15927,
      2016: 155111,
    },
  }
});


const tableTemplate = function(model) {
  console.log("MODEL", model);
  return `<table class="funding-table">
    <tbody>
      <tr>
        <th>
          <select class="currency-select" name="currency">
            <option>"USD"</option>
            <option>"CAD"</option>
            <option>"AUD"</option>
            <option>"GBP"</option>
            <option>"EUR"</option>
          </select>
        </th>
        <th>2016</th>
        <th></th>
        <th>2015</th>
        <th></th>
        <th>2014</th>
        <th></th>
      </tr>
      <tr>
        <td>${I18n.t('pages.funding.total')}</td>
        <td class="right-align">get total num from model</td>
        <td></td>
        <td class="right-align">$4,857,359</td>
        <td></td>
        <td class="right-align">$4,426,005</td>
      </tr>
      <tr>
        <td>${I18n.t('pages.funding.individuals')}</td>
        <td class="right-align">$3,869,976</td>
        <td class="right-align">84%</td>
        <td class="right-align">$4,080,182</td>
        <td class="right-align">84%</td>
        <td class="right-align">$3,655,474</td>
        <td class="right-align">83%</td>
      </tr>
      <tr>
        <td>${I18n.t('pages.funding.foundations')}</td>
        <td class="right-align">$612,728</td>
        <td class="right-align">13%</td>
        <td class="right-align">$761,250</td>
        <td class="right-align">16%</td>
        <td class="right-align">$748,712</td>
        <td class="right-align">17%</td>
      </tr>
      <tr>
        <td>${I18n.t('pages.funding.other')}</td>
        <td class="right-align">$155,111</td>
        <td class="right-align">3%</td>
        <td class="right-align">$15,927</td>
        <td class="right-align">0%</td>
        <td class="right-align">$21,819</td>
        <td class="right-align">0%</td>
      </tr>
    </tbody>
  </table>`;
}

const FundingTable = Backbone.View.extend({
  events: {
    'change .currency-select': 'changeCurrency',
  },

  el: '.funding-table-container',

  model: new Funding(),

  initialize: function() {
    console.log("Initialize");
    // render initial format - default to USD
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  render: function() {
    console.log("Model: ", this.model.attributes);
    this.$el.html(this.template(this.model.toJSON));
    return this;
  },

  changeCurrency(e) {
    // TODO: write currency conversion function for the table element
    console.log("Changed Currency!");
  },

  // use te slim template in source/localizable/_funding.slim, if possible
  // replace hard coded values with values from the model
  template: tableTemplate,
});

const conversionRates = {
  AUD: {
    2014: 0.8666,
    2015: 0.7435,
    2016: 0.7143,
  },
  CAD: {
    2014: 0.8703,
    2015: 0.7524,
    2016: 0.7252,
  },
  EUR: {
    2014: 1.2755,
    2015: 1.0672,
    2016: 1.0638,
  },
  GBP: {
    2014: 1.5823,
    2015: 1.4684,
    2016: 1.2987
  }
}

module.exports = FundingTable;
