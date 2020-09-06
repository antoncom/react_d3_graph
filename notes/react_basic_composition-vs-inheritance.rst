Композиция против наследования
------------------------------


Вставка
+++++++

Некоторые компоненты не знают своих потомков заранее. Это особенно характерно для таких компонентов, как Sidebar или Dialog, которые представляют из себя как бы «коробку», в которую можно что-то положить.

Для таких компонентов Facebook рекомендуем использовать специальный проп children, который передаст дочерние элементы сразу на вывод:

.. code-block:: html

	function FancyBorder(props) {
	  return (
	    <div className={'FancyBorder FancyBorder-' + props.color}>
	      {props.children}
	    </div>
	  );
	}

Это позволит передать компоненту произвольные дочерние элементы, вложив их в JSX:

.. code-block:: html

	function WelcomeDialog() {
	  return (
	    <FancyBorder color="blue">
	      <h1 className="Dialog-title">
	        Добро пожаловать
	      </h1>
	      <p className="Dialog-message">
	        Спасибо, что посетили наш космический корабль!
	      </p>
	    </FancyBorder>
	  );
	}

Всё, что находится внутри JSX-тега <FancyBorder>, передаётся в компонент FancyBorder через проп children. Поскольку FancyBorder рендерит {props.children} внутри <div>, все переданные элементы отображаются в конечном выводе.


Аналог Slot-ов
++++++++++++++

Иногда в компоненте необходимо иметь несколько мест для вставки. В таком случае можно придумать свой формат, а не использовать children:

.. code-block:: html

	function SplitPane(props) {
	  return (
	    <div className="SplitPane">
	      <div className="SplitPane-left">
	        {props.left}
	      </div>
	      <div className="SplitPane-right">
	        {props.right}
	      </div>
	    </div>
	  );
	}

	function App() {
	  return (
	    <SplitPane
	      left={
	        <Contacts />
	      }
	      right={
	        <Chat />
	      } />
	  );
	}

Такие React-элементы, как <Contacts /> и <Chat /> являются просто объектами, поэтому их можно передать в виде пропсов, как и любые другие данные. Этот подход может напоминать понятие «слотов» в других библиотеках, однако, в React нет никаких ограничений на то, что можно передать в качестве пропсов.

Специализация
-------------

Некоторые компоненты можно рассматривать как «частные случаи» других компонентов. Например, WelcomeDialog может быть частным случаем Dialog.

В React это можно сделать через композицию, где «частный» вариант компонента рендерит более «общий» и настраивает его с помощью пропсов:

.. code-block:: html

	function Dialog(props) {
	  return (
	    <FancyBorder color="blue">
	      <h1 className="Dialog-title">
	        {props.title}
	      </h1>
	      <p className="Dialog-message">
	        {props.message}
	      </p>
	    </FancyBorder>
	  );
	}

	function WelcomeDialog() {
	  return (
	    <Dialog
	      title="Добро пожаловать"
	      message="Спасибо, что посетили наш космический корабль!" />
	  );
	}

Композиция хорошо работает и для компонентов, определённых через классы:

.. code-block:: html

	function Dialog(props) {
	  return (
	    <FancyBorder color="blue">
	      <h1 className="Dialog-title">
	        {props.title}
	      </h1>
	      <p className="Dialog-message">
	        {props.message}
	      </p>
	      {props.children}
	    </FancyBorder>
	  );
	}

	class SignUpDialog extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSignUp = this.handleSignUp.bind(this);
	    this.state = {login: ''};
	  }

	  render() {
	    return (
	      <Dialog title="Программа исследования Марса"
	              message="Как к вам обращаться?">
	        <input value={this.state.login}
	               onChange={this.handleChange} />
	        <button onClick={this.handleSignUp}>
	          Запишите меня!
	        </button>
	      </Dialog>
	    );
	  }

	  handleChange(e) {
	    this.setState({login: e.target.value});
	  }

	  handleSignUp() {
	    alert(`Добро пожаловать на борт, ${this.state.login}!`);
	  }
	}

Забыть о наследовании
---------------------

.. epigraph::

   В Facebook мы используем React в тысячах компонентов, и не находили случаев, когда бы рекомендовали создавать иерархии наследования компонентов.
    
   Пропсы и композиция дают вам всю гибкость, необходимую для настройки внешнего вида и поведения компонента явным и безопасным способом. Помните, что компоненты могут принимать произвольные пропсы, включая примитивные значения, React-элементы или функции.
   
   Если вы хотите повторно использовать не связанную с внешним видом функциональность между компонентами, извлеките её в отдельный JavaScript-модуль. Импортируйте его в компонент и используйте эту функцию, объект или класс, не расширяя их.

   -- https://ru.reactjs.org/docs/composition-vs-inheritance.html

