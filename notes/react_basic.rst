Перед созданием React-компонента необходимо изучить мат.часть. Ниже даю краткий конспект некоторых отличий от VueJS или SvelteJS.
"Состояние и жизненный цикл" https://ru.reactjs.org/docs/state-and-lifecycle.html

Важные методы
-------------

* constructor()
* componentDidMount()
* componentWillUnmount()
* render()

this.setState()
---------------

.. code-block:: JavaScript

    // Неправильно
    this.state.comment = 'Привет';

.. code-block:: JavaScript

    // Правильно
    this.setState({comment: 'Привет'});

Однако в конструкторе допускается присвоение напрямую:

.. code-block:: JavaScript

    this.state.comment = 'Привет';

Асинхронность состояний
-----------------------

Поскольку this.props и this.state могут обновляться асинхронно, вы не должны полагаться на их текущее значение для вычисления следующего состояния.

.. code-block:: JavaScript

    // Неправильно
    this.setState({
      counter: this.state.counter + this.props.increment,
    });

.. code-block:: JavaScript

    // Правильно
    this.setState((state, props) => ({
      counter: state.counter + props.increment
    }));

.. code-block:: JavaScript

    // Правильно
    this.setState(function(state, props) {
      return {
        counter: state.counter + props.increment
      };
    });

Т.е., по сути, мы применяем метод функционального программирования для "запекания" функции, передаваемой в виде аргумента в this.setState(). В таком случае эта функция вернёт актуальный объект, основанный на this.state или this.props.

Обновления состояния объединяются
---------------------------------

.. code-block:: JavaScript
  
    constructor(props) {
      super(props);
      this.state = {
        posts: [],
        comments: []
      };
    }

Их можно обновлять по отдельности с помощью отдельных вызовов setState():

.. code-block:: JavaScript

  componentDidMount() {
      fetchPosts().then(response => {
        this.setState({
          posts: response.posts
        });
      });

      fetchComments().then(response => {
        this.setState({
          comments: response.comments
        });
      });
  }

Вызов this.setState({comments}) оставляет this.state.posts нетронутым, но полностью заменяет this.state.comments.

Однонаправленный поток данных
-----------------------------

С этим всё ясно.

Обработка событий
-----------------

* События в React именуются в стиле camelCase вместо нижнего регистра.
* С JSX вы передаёте функцию как обработчик события вместо строки.
  
.. code-block:: HTML

    <!-- Например, в HTML: -->
    <button onclick="activateLasers()">
      Активировать лазеры
    </button>

.. code-block:: HTML

    <!-- В React немного иначе: -->
    <button onClick={activateLasers}>
      Активировать лазеры
    </button>

Обработчик события на "функциях"
++++++++++++++++++++++++++++++++

.. code-block:: HTML

    function ActionLink() {
      function handleClick(e) {
        e.preventDefault();
        console.log('По ссылке кликнули.');
      }

      return (
        <a href="#" onClick={handleClick}>
          Нажми на меня
        </a>
      );
    }

Обработчик событий на компонентах
+++++++++++++++++++++++++++++++++

В компоненте, определённом с помощью ES6-класса, в качестве обработчика события обычно выступает один из методов класса. Например, этот компонент Toggle рендерит кнопку, которая позволяет пользователю переключать состояния между «Включено» и «Выключено»:

.. code-block:: HTML

    class Toggle extends React.Component {
      constructor(props) {
        super(props);
        this.state = {isToggleOn: true};

        // Эта привязка обязательна для работы `this` в колбэке.
        this.handleClick = this.handleClick.bind(this);
      }

      handleClick() {
        this.setState(state => ({
          isToggleOn: !state.isToggleOn
        }));
      }

      render() {
        return (
          <button onClick={this.handleClick}>
            {this.state.isToggleOn ? 'Включено' : 'Выключено'}
          </button>
        );
      }
    }

    ReactDOM.render(
      <Toggle />,
      document.getElementById('root')
    );


Как не пользоваться bind()
++++++++++++++++++++++++++

.. code-block:: HTML

    class LoggingButton extends React.Component {
      // Такой синтаксис гарантирует, что `this` привязан к handleClick.
      // Предупреждение: это экспериментальный синтаксис, доступен в https://github.com/facebook/create-react-app
      handleClick = () => {
        console.log('значение this:', this);
      }

      render() {
        return (
          <button onClick={this.handleClick}>
            Нажми на меня
          </button>
        );
      }
    }


Передача аргументов в обработчики событий
-----------------------------------------

Внутри цикла часто нужно передать дополнительный аргумент в обработчик события. Например, если id — это идентификатор строки, можно использовать следующие варианты:

.. code-block:: html

    <button onClick={(e) => this.deleteRow(id, e)}>Удалить строку</button>
    <button onClick={this.deleteRow.bind(this, id)}>Удалить строку</button>

Две строки выше — эквивалентны, и используют стрелочные функции и Function.prototype.bind соответственно.

В обоих случаях аргумент e, представляющий событие React, будет передан как второй аргумент после идентификатора. Используя стрелочную функцию, необходимо передавать аргумент явно, но с bind любые последующие аргументы передаются автоматически.
