defmodule Flash.SectionController do
  use Flash.Web, :controller
  require Logger
  alias Flash.Section




  def index(conn, %{"book" => b}) do
    s = Repo.all(from s in Section, where: s.book == ^b)
    render(conn, :index, sections: s)
  end

  def index(conn, _params) do
    s = Repo.all(from s in Section, where: s.active == true)
		
    render(conn, :index, sections: s)
  end

end
