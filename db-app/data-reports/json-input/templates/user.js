[
  {
    'repeat(100)': {
      _id: '{{objectId()}}',
      firstname: '{{firstName()}}',
      lastname: '{{surname()}}',
      username: function (tags) {
		var useFirstname = tags.bool();
        
        if(useFirstname) {
          return this.firstname + '_' + tags.integer(0, 334);
		}
        return this.lastname + '_' + tags.integer(0, 100);
      },
      picture: 'https://www.bartbusschots.ie/s/wp-content/uploads/2016/01/PBS_Logo.png',
      age: '{{integer(7, 60)}}',
      email: function (tags) {
        return (this.firstname + '.' + this.lastname + '@' + tags.company() + tags.domainZone()).toLowerCase();
      },
      phone: '+359 {{phone()}}',
      address: '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
      about: '{{lorem(1, "paragraphs")}}',
      registered: '{{moment(this.date(new Date(2014, 0, 1), new Date())).format("LLLL")}}'
    }
  }
]