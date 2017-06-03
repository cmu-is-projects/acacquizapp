defmodule Flash.QuestionView do
  use Flash.Web, :view
  
  def render("random.json", %{questions: questions}) do
  	%{response: questions}
  end
   
end
