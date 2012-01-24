String.Format = function(format, args) {
    /// <summary> Builds a string from a template. </summary>
    /// <param name="format" type="String"> A composite format string, using curly braces as placeholders.</param>
    /// <param name="args" type="Object">The objects to be used for formatting. Supports the "params"-like syntax.</param>
    /// <returns type="String"></returns>

    // To support a "params"-like syntax, we must retrieve all our arguments into an actual array:
    var allArgs = Array.prototype.slice.call(arguments, 1);
    
    return format.replace(/{([^{}:]*)(?:[:]([^}]*))?}/g, function(m, selector, valueFormat) {
                                                           var value = String.Format.evalSelector(allArgs, selector);
                                                           return String.Format.evalValueFormat(value, valueFormat);
                                                       });
};
String.Format.evalSelector = function(args, selector) {
    // Evaluate the selector, allowing dot-notation:
    var selectors = selector.split(".");
    var value = args;
    if (isNaN(selectors[0])) {
        value = args[0]; // Default to first item if first selector isn't an index
    }
    // Evaluate each item in the selector:
    for (var p = 0; p < selectors.length && value !== undefined; p++) {
        value = value[selectors[p]];
    }
    return value;
};
String.Format.formatters = [];
String.Format.evalValueFormat = function(value, valueFormat) {
    // Format the value using any of the formatters:
    var formatted = undefined;
    for (var i = 0; i < String.Format.formatters.length && formatted === undefined; i++) {
        formatted = String.Format.formatters[i](value, valueFormat);
        // If the formatter returns a value, we're done formatting:
        if (formatted !== undefined) {
            value = formatted;
            break;
        }
    }
    return value;
};



// Formatters:
String.Format.NumberFormatter = function (arg, format) {
    if (typeof (arg) != "number") return;
    if (format == "") return;
    var namedFormat = (/^([NC])(\d*)$/).exec(format);
    if (namedFormat && namedFormat.length > 0) {
        var digits = Number(namedFormat[2] || "2");
        // Insert commas:
        var result = arg.toFixed(digits);
        var missingCommas = /^([-]?\d+)(\d{3})/;
        while (missingCommas.test(result)) {
            result = result.replace(missingCommas, '$1,$2');
        }
        if (namedFormat[1] == "C") { // Format currency
            result = result.replace(/^-?/, "$0\\$")
        }
        return result;
    }
    // Custom format: ###,000.00
    var places = format.match(/[#0.][^#0.]*/g);
    if (places && places.length > 0) {
        // Find the number of decimals:
        var d = 0;
        for (var i = 0; i < places.length; i++) {
            if (places[i].indexOf(".") == 0) {
                d = (places.length - i - 1);
                break;
            }
        }
        // Compose the output
        var result = [];
        var value = arg.toFixed(d).split("");
        for (var i = places.length-1; i >= 0; i--) {
            var place = places[i];
            if (place.indexOf("#") ==0) {
                if (value.length > 0) {
                    result.unshift(place.substr(1));
                    result.unshift(value.pop());
                }
            } else if (place.indexOf("0")==0) {
                result.unshift(place.substr(1));
                result.unshift(value.length > 0 ? value.pop() : "0");
            } else {
                result.unshift(place);
                value.pop();
            }
        }
        if (value.length) result.unshift(value.join(""));
        
        return result.join("");
    }
        
};
String.Format.formatters.push(String.Format.NumberFormatter);
