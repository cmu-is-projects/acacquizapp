defmodule Flash.Router do
  use Flash.Web, :router

  pipeline :browser do
    plug :accepts, ["html", "json"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/", Flash do
    pipe_through :browser # Use the default browser stack
    get "/random", QuestionController, :random
    get "/section", SectionController, :index
    get "/", PageController, :index
    resources "/questions", QuestionController
  end


end
