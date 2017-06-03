defmodule Flash.Question do
  require Logger
  alias Flash.Repo
  alias Flash.Section
  use Flash.Web, :model

  schema "questions" do
    field :text, :string
    field :answer, :string
    field :book, :string
    field :chapter, :integer
    field :verse, :string
    field :question_type_id, :integer
    field :section_id, :integer
  end

  defmodule Queries do

    def randomUnique(_, _, limit, result) when length(result) == limit do
	  Logger.info length result
      result
    end

    def randomUnique(bottom, top, limit, result) do
      verse = :rand.uniform(top) - bottom
	  Logger.debug verse
      case Enum.member?(result, verse) do
        true ->
          randomUnique(bottom, top, limit, result)
        false ->
          randomUnique(bottom, top, limit,  result ++ [verse])
      end     
    end

    def random(book, section_id, limit) do
      sectionQuery = Repo.get!(Section, section_id)
      
      verses = randomUnique(sectionQuery.start_verse, sectionQuery.end_verse, String.to_integer(limit), [])
      for verse_id <- verses, into: [] do
	    Logger.debug verse_id
        query = Ecto.Adapters.SQL.query( 
          Flash.Repo,
          "SELECT id, text, answer, question_type_id, verse, section_id, book, chapter FROM questions WHERE (book=$1 AND verse LIKE $2 and CHAPTER=$3) ORDER BY RANDOM() LIMIT 1;",
          [book, "%" <> Integer.to_string(verse_id) <> "%", sectionQuery.chapter])
        {:ok, %{rows: [row]}} = query
        [id, text, answer, question_type_id, verse, section_id, book, chapter] = row
        [%{id: id, text: text, answer: answer, question_type_id: question_type_id, verse: verse, section_id: section_id, book: book, chapter: chapter}]
      end
    end
    
    def random_id(section_id, limit) do
      sectionQuery = Repo.get!(Section, section_id)
      
      verses = randomUnique(sectionQuery.start_verse, sectionQuery.end_verse, String.to_integer(limit), [])
      for verse_id <- verses, into: [] do
	    Logger.debug verse_id
        query = Ecto.Adapters.SQL.query( 
          Flash.Repo,
          "SELECT id, text, answer, question_type_id, verse, section_id, book, chapter FROM questions WHERE (book=$1 AND verse LIKE $2 and CHAPTER=$3) ORDER BY RANDOM() LIMIT 1;",
          [sectionQuery.book, "%" <> Integer.to_string(verse_id) <> "%", sectionQuery.chapter])
        {:ok, %{rows: [row]}} = query
        [id, text, answer, question_type_id, verse, section_id, book, chapter] = row
        [%{id: id, text: text, answer: answer, question_type_id: question_type_id, verse: verse, section_id: section_id, book: book, chapter: chapter}]
      end
    end
    
  end  

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:text, :answer])
    |> validate_required([:text, :answer])
  end
end
