/* ----------------------------------------------------------
simulates the .net string builder class. preferred way
of constructing large strings instead of using concats.
Always null out / reset the obj after you're done with it (prevents IE memory leaks)

ex. 
var html = new StringBuilder();
html.append("<p>", text, "</p>");
html.append("<br />");
var output = html.toString();
html.reset();
html = null; // prevents memory leaks in IE
---------------------------------------------------------- */
function StringBuilder() {
    /// <summary>Efficiently constructs large strings</summary>
    /// <field name="length" type="Number" integer="true"> The total length of the in-progress string. </field>
    /// <field name="strings" type="Array" elementType="String"> Private. Contains all appended strings. </field>
    this.strings = [];
    this.length = 0;
};
StringBuilder.prototype.toString = function(noReset) {
    /// <summary>Returns the entire "built" string</summary>
    /// <param name="noReset" type="Boolean" optional="true">
    ///     Calling toString() resets the StringBuilder. This is to prevent memory leaks.
    ///     Supplying a value of true will prevent this behavior.
    /// </param>
    /// <returns type="String" />
    
    var output = this.strings.join('');
    if (!noReset) this.reset();
    return output;
};
StringBuilder.prototype.append = function(strings) {
    /// <summary>Appends a string to the StringBuilder</summary>
    /// <param name="strings" parameterArray="true" elementType="String">The string, or a list of strings, to append.</param>
    /// <returns type="StringBuilder"></returns>
    
    Array.prototype.push.apply(this.strings, arguments);
    // Calculate the new length:
    for (var i = 0; i < arguments.length; i++) {
        this.length += arguments[i].length;
    }
    return this;
};
StringBuilder.prototype.appendFormat = function(format, args) {
    /// <summary>Builds a string from a template</summary>
    /// <param name="format" type="String"> A composite format string, using curly braces as placeholders.</param>
    /// <param name="args" parameterArray="true" elementType="Object">The objects to be used for formatting. Supports the "params"-like syntax.</param>
    /// <returns type="StringBuilder"></returns>
    return this.append(String.Format.apply(this, arguments));
};
StringBuilder.prototype.reset = function() {
    /// <summary>Resets the StringBuilder, clearing all text</summary>
    /// <returns type="StringBuilder" />
    this.strings = [];
    this.length = 0;
    return this;
};
