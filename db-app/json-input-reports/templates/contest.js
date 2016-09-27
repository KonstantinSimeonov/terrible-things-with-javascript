[
  {
    'repeat(100)': {
      _id: '{{objectId()}}',
      name: function (tags) {

          var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          var disciplines = [
              'JavaScript Fundamentals',
              'JavaScript OOP',
              'Functional JavaScript',
              'Haskell Fundamentals',
              'Data structures and Algorithms',
              'Programming Fundamentals',
              'Functional Scala',
              'Scala OOP',
              'Ruby',
              'SQL',
              'MongoDB'
          ];

          var name = disciplines[tags.integer(0, disciplines.length - 1)],
            date = new Date(new Date(2008, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2010, 0, 1).getTime()));

        return name + ' ' + months[date.getMonth() - 1] + ' ' + date.getFullYear();
      },
      categories: function (tags) {
          return this.name.toLowerCase().split(' ');
      },
      creationDate: '{{date()}}',
      startDate: function (tags) {
          var day = 24 * 60 * 60;
          return new Date(this.creationDate + day * tags.integer(1, 20));
      },
      endDate: function (tags) {
          var day = 24 * 60 * 60;
          return new Date(this.startDate + tags.integer(day, day * 1.5));
      },
      description: '{{lorem(2, "sentences")}}',
      password: function (tags) {
          return tags.city().toLowerCase() + new Date(new Date(2008, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2010, 0, 1).getTime())).getYear();
      }
    }
  }
]