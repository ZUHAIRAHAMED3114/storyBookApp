const moment = require('moment');
module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format)
    },
    truncate: function(data, length) {
        if (data.length > length && length > 0) {
            let new_data = data + '';
            new_data = data.substr(0, length);
            new_data = data.substr(0, new_data.lastIndexOf(' '));
            new_data = new_data.length > 0 ? new_data : data.substr(0, length);
            return new_data + '...';
        } else return data;
    },
    stripTags: function(input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    editIcon: function(storyUser, loggedUser, floating = true) {
        if (storyUser._id.toString() === loggedUser._id.toString()) {
            if (floating) {

                return {
                    hasValue: true,
                    value: storyUser._id,
                    floating: true
                }
            } else {
                return {
                    hasValue: true,
                    value: storyUser._id,
                    floating: false
                } //`<a href="/stories/edit/${storyUser._id}"><i class="fas fa-edit"></i></a>`

            }

        } else {
            return {
                hasValue: false
            };
        }
    }

}